import * as rm from 'typed-rest-client/RestClient'
import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

interface RawStarWarsFilm {
    url: string;
    title: string;
    release_date: string;
    characters: string[]; // URLs of character resources
}

interface RawStarWarsFilmsResponse {
    results: RawStarWarsFilm[];
}

interface RawStarWarsPerson {
    name: string;
}

export interface StarWarsFilm {
    id: number; // as far as I can tell this needs to be parsed from URL
    title: string;
    release_date: string; // Format 'YYYY-MM-DD'
}

export interface StarWarsCharacter {
    id: number;
    name: string;
}

export class SwapiService {
    private restClient: rm.RestClient;
    private cache: CacheContainer;

    constructor() {
        this.restClient = new rm.RestClient('rest-samples', 'https://swapi.dev/api/')
        this.cache = new CacheContainer(new MemoryStorage())
    }

    public async getAllFilms(): Promise<StarWarsFilm[]> {
        const cachedFilms = await this.cache.getItem<StarWarsFilm[]>("films");
        if (cachedFilms) {
            return cachedFilms;
        }
        let response = await this.restClient.get<RawStarWarsFilmsResponse>('films')
        if (!response.result) {
            throw new Error(`Unable to get response for all films`)
        }
        const films = response.result.results.map(rawResult => {
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

    public async getAllCharactersByFilmId(filmId: number): Promise<StarWarsCharacter[]> {
        const cacheKey = `characters_by_film_${filmId}`;
        const cachedCharacters = await this.cache.getItem<StarWarsCharacter[]>(cacheKey)
        if (cachedCharacters) {
            return cachedCharacters;
        }
        let filmResponse = await this.restClient.get<RawStarWarsFilm>(`films/${filmId}`);
        if (!filmResponse.result) {
            throw new Error(`Unable to get response for filmId ${filmId}`)
        }
        const charactersInFilmUrls = filmResponse.result.characters;
        const characters = Promise.all(charactersInFilmUrls.map(async characterUrl => {
            const characterId = this.getCharacterIdFromUrl(characterUrl);
            const person = await this.restClient.get<RawStarWarsPerson>(`people/${characterId}`);
            return {
                id: characterId,
                name: person.result?.name || ''
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

