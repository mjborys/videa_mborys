export interface RawStarWarsFilm {
    url: string;
    title: string;
    release_date: string;
    characters: string[]; // URLs of character resources
}

export interface RawStarWarsFilmsResponse {
    results: RawStarWarsFilm[];
}

export interface RawStarWarsPerson {
    name: string;
}

export interface IStarWarsDataStore {
    getAllFilms(): Promise<RawStarWarsFilmsResponse>;
    getFilmById(filmId: number): Promise<RawStarWarsFilm | null>;
    getPersonById(personId: number): Promise<RawStarWarsPerson | null>;
}