import * as rm from 'typed-rest-client/RestClient'

export interface StarWarsFilm {
    id: number;
    title: string;
    release_date: string; // Format 'YYYY-MM-DD'
}

export class SwapiService {
    // private restClient: RestClient;

    constructor() {
        // this.restClient = new RestClient('rest-samples', 'https://swapi.dev/api')
    }

    public async getAllFilms(): Promise<StarWarsFilm[]> {
        let rest: rm.RestClient = new rm.RestClient('rest-samples')
        let response = await rest.get<StarWarsFilm[]>('https://swapi.dev/api/films');
        if (!response.result) {
            console.log(`RESPONSE: ${JSON.stringify(response)}`)
            throw new Error(`Unable to get response`)
        }
        return response.result;
        // console.log(response)
        // console.log(response.result)
        // return [{ id: 0, title: 'Fake Star Wars Film', release_date: '1990-12-13' }]
    }
}

