import express from "express";
import { SwapiService } from "./swapi.service";

const app = express();
const port = 8080;
const swService = new SwapiService();
app.use(express.json())

app.get("/films", async (req: any, res: any) => {
    const response = await swService.getAllFilms();
    res.send(response);
});

app.post("/characters", async (req, res) => {
    const filmId: number = parseInt(req.body.filmId);
    const response = await swService.getAllCharactersByFilmId(filmId)
    res.send(response);
})

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});