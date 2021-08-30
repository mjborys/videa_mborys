import "reflect-metadata";
import { container } from 'tsyringe';
import app from './app'
import { StarWarsRESTDataStore } from './swapi.rest.datastore';

container.register("IStarWarsDataStore", {
    useClass: StarWarsRESTDataStore
})

app.listen(8080, () => {
    console.log(`server started at http://localhost:${8080}`);
});