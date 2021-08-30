import { IStarWarsDataStore, RawStarWarsFilm, RawStarWarsFilmsResponse, RawStarWarsPerson } from "../src/data.types";
import {allFilmsResponse, singleFilmResponse, singlePersonResponse, } from './swapi.mock.responses';

export class MockStarWarsDatastore implements IStarWarsDataStore{
    getAllFilms(): Promise<RawStarWarsFilmsResponse> {
        return Promise.resolve(allFilmsResponse)
    }
    getFilmById(filmId: number): Promise<RawStarWarsFilm | null> {
        if (filmId < 6) {
            return Promise.resolve(singleFilmResponse)
        }
        return Promise.resolve(null);

    }
    getPersonById(personId: number): Promise<RawStarWarsPerson | null> {
        return Promise.resolve(singlePersonResponse)
    }

}