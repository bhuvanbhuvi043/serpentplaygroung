# Word Serpent

Word Serpent is a browser-based word and snake game. The rebuilt root game uses a single reliable canvas engine with snake body letters, apple letter effects, stage questions, stars, keyboard controls, and on-screen direction buttons.

## Folder structure

```text
.
|-- assets/
|   |-- archives/       Original uploaded zip archive
|   |-- audio/          Background music
|   `-- images/         Game and stage artwork
|-- src/
|   |-- js/             Home page and stage scripts
|   `-- styles/         Home page and game styles
|-- stages/             Legacy Stage 1 through Stage 7 pages
|-- index.html          Rebuilt playable game
|-- package.json        Convenience local-server scripts
`-- LICENSE
```

## Run locally

Use any static file server from the project root:

```bash
npm start
```

Then open:

```text
http://localhost:8080
```

You can also use Python if Node is not available:

```bash
python -m http.server 8080
```

## Notes

- Stages 1-7 are implemented.
- The root `index.html` is the recommended playable game.
- Legacy stage pages remain in `stages/` for reference.
- The speed slider stores the selected speed in browser local storage.
