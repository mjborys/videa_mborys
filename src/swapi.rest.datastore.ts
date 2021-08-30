import { IStarWarsDataStore, RawStarWarsFilm, RawStarWarsFilmsResponse, RawStarWarsPerson } from "./data.types";
import * as rm from 'typed-rest-client/RestClient'

export class StarWarsRESTDataStore implements IStarWarsDataStore{
    private restClient: rm.RestClient;

    constructor() {
        this.restClient = new rm.RestClient('rest-samples', 'https://swapi.dev/api/');
    }

    async getAllFilms(): Promise<RawStarWarsFilmsResponse> {
        const swapiResponse = await this.restClient.get<RawStarWarsFilmsResponse>('films')
        if (!swapiResponse.result) {
            throw new Error(`Unable to get response for all films`)
        }
        return swapiResponse.result;
    }

    async getFilmById(filmId: number): Promise<RawStarWarsFilm | null> {
        const swapiResponse = await this.restClient.get<RawStarWarsFilm>(`films/${filmId}`);
        return swapiResponse.result || null;
    }

    async getPersonById(personId: number): Promise<RawStarWarsPerson | null> {
        const swapiResponse = await this.restClient.get<RawStarWarsPerson>(`people/${personId}`);
        return swapiResponse.result || null;
    }    
}