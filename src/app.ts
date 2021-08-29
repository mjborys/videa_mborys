import express from "express";
import { SwapiService } from "./swapi.service";

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get("/", (req: any, res: any) => {
    res.send("Hello world!");
});

app.get("/films", async (req: any, res: any) => {
    // res.send("Some films");
    const swService = new SwapiService();
    const response = await swService.getAllFilms();
    console.log(`Response: ${JSON.stringify(response)}`)
    res.send(response);
    // return response;
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});