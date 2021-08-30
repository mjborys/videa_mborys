import "reflect-metadata";
import app from '../src/app';
import supertest from 'supertest';
import { StarWarsCharacter, StarWarsFilm } from '../src/swapi.service';
import { container } from 'tsyringe';
import { MockStarWarsDatastore } from './swapi.mock.datastore';


describe('Star wars films API tests', () => {
    beforeEach(() => {
        container.register("IStarWarsDataStore", {
            useClass: MockStarWarsDatastore
        })
    })

    describe(`GET /films`, () => {
        it('returns 200 with data', async () => {
            await supertest(app).get("/films").expect(200).then(response => {
                expect(response).not.toBeNull()
                const films: StarWarsFilm[] = JSON.parse(response.text);
                expect(films.length).toBe(6);
            })
        })
    });

    describe(`POST /characters`, () => {
        it('returns characters given a valid filmId', async () => {
            await supertest(app).post("/characters").send({ filmId: 2 }).set('Accept', 'application/json').expect(200).then(response => {
                expect(response).not.toBeNull();
                const characters: StarWarsCharacter[] = JSON.parse(response.text);
                expect(characters.find(character => character.name === "Luke Skywalker")).toBeTruthy()
            })
        })

        it('returns 400 if given malformed filmId', async () => {
            await supertest(app).post("/characters").send({ filmId: 'invalid_film_id' }).set('Accept', 'application/json').expect(400);
        })

        it('returns 404 if filmId is a number but cannot be found', async () => {
            await supertest(app).post("/characters").send({ filmId: 500 }).set('Accept', 'application/json').expect(404);
        })
    })
})
