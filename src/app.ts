import express from "express";
import { SwapiService } from "./swapi.service";

const app = express();
const swService = new SwapiService();
app.use(express.json())

app.get("/films", async (req, res) => {
    try {
        const response = await swService.getAllFilms();
        res.send(response);
    } catch (error) {
        console.log(`Error in /films: ${error}`)
        res.status(500);
        res.send()
    }
});

app.post("/characters", async (req, res) => {
    const filmId: number = parseInt(req.body.filmId);
    if (!filmId) {
        res.status(400)
        res.send('Provide a numeric filmId. Use GET /films for a list of filmIds');
        return;
    }
    const response = await swService.getAllCharactersByFilmId(filmId)
    if (!response) {
        res.status(404);
        res.send(null);
        return;
    }
    res.send(response);
})

export default app;