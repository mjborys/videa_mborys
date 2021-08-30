import express from "express";
import { container } from "tsyringe";
import { SwapiService } from "./swapi.service";

const app = express();
app.use(express.json())

app.get("/films", async (req, res) => {
    try {
        const response = await container.resolve(SwapiService).getAllFilms();
        res.send(response);
    } catch (error) {
        console.log(`Error in /films: ${error}`)
        res.status(500);
        res.send(null)
    }
});

app.post("/characters", async (req, res) => {
    const filmId: number = parseInt(req.body.filmId);
    if (!filmId) {
        res.status(400)
        res.send('Provide a numeric filmId. Use GET /films for a list of filmIds');
        return;
    }
    const response = await container.resolve(SwapiService).getAllCharactersByFilmId(filmId)
    if (!response) {
        res.status(404);
        res.send(null);
        return;
    }
    res.send(response);
})

export default app;