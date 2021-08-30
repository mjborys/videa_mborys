import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'
import { inject, injectable } from 'tsyringe';
import { IStarWarsDataStore } from './data.types';

export interface StarWarsFilm {
    id: number; // as far as I can tell this needs to be parsed from URL
    title: string;
    release_date: string; // Format 'YYYY-MM-DD'
}

export interface StarWarsCharacter {
    id: number;
    name: string;
}

@injectable()
export class SwapiService {
    private cache: CacheContainer;
    private _dataStore: IStarWarsDataStore;

    constructor(@inject("IStarWarsDataStore") private datastore: IStarWarsDataStore) {
        this.cache = new CacheContainer(new MemoryStorage());
        this._dataStore = datastore;
    }

    public async getAllFilms(): Promise<StarWarsFilm[]> {
        const cachedFilms = await this.cache.getItem<StarWarsFilm[]>("films");
        if (cachedFilms) {
            return cachedFilms;
        }
        const rawFilms = await this._dataStore.getAllFilms();
        const films = rawFilms.results.map(rawResult => {
            return {
                id: this.getFilmIdFromUrl(rawResult.url),
                title: rawResult.title,
                release_date: rawResult.release_date
            }
        });
        this.cache.setItem("films", films, {
            ttl: 3600
        })
        return films;
    }

    public async getAllCharactersByFilmId(filmId: number): Promise<StarWarsCharacter[] | null> {
        const cacheKey = `characters_by_film_${filmId}`;
        const cachedCharacters = await this.cache.getItem<StarWarsCharacter[]>(cacheKey)
        if (cachedCharacters) {
            return cachedCharacters;
        }
        let rawFilm = await this._dataStore.getFilmById(filmId);
        if (!rawFilm) {
            return null;
        }
        const charactersInFilmUrls = rawFilm.characters;
        const characters = Promise.all(charactersInFilmUrls.map(async characterUrl => {
            const characterId = this.getCharacterIdFromUrl(characterUrl);
            const person = await this._dataStore.getPersonById(characterId);
            return {
                id: characterId,
                // Decision made here to not disrupt the whole response just because we cant find a character name,
                // we can still return other characters. Could also throw a 404 and error here if this is deemed critical.
                name: person?.name || ``
            }
        }))
        this.cache.setItem(cacheKey, characters, { ttl: 3600 })
        return characters
    }

    /** 
     * Extracts a film ID from the response URL
     * @example: "https://swapi.dev/api/films/2/" ==> 2
     */
    private getFilmIdFromUrl(url: string): number {
        return this.getIdFromUrlPathname(url, 3);
    }

    /** 
     * Extracts a character ID from the response URL
     * @example: "https://swapi.dev/api/people/5/" ==> 5
     */
    private getCharacterIdFromUrl(url: string): number {
        return this.getIdFromUrlPathname(url, 3);
    }

    private getIdFromUrlPathname(url: string, position: number) {
        return parseInt(new URL(url).pathname.split('/')[position]);
    }
}

