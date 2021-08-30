# Starwars API

Coding challenge for Videa Health by Michael Borys

## Docker note

I am developing this on a home PC with a free version of Windows which I primarily use for gaming. When attempting to install and run Docker I hit a lot of roadblocks, fixes for which seem to involve reinstalling a different version of Windows and adding Windows Subsystem for Linux (WSL), and frankly I don't want to spend the time doing that. I've provided a Dockerfile that may or may not work, but have run and tested this service directly on my machine and I'll give instructions for doing that below.

## Starting up

The following commands should get you going:

```
npm install
npm run start
```

## Use

You can now make a POST or GET to http://localhost:8080.

GET http://localhost:8080/films for all films

POST http://localhost:8080/characters for all characters in a given film with a body like

```
{
    "filmId": 1
}
```

## Test

This project uses a mocked SWAPI implementation from a hard-coded datastore for testing. Tests can be found in the `/tests` directory and run with

```
npm test
```
