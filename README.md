# Word Serpent

Word Serpent is a browser-based word and snake game. The root game uses a reliable canvas engine with snake body letters, polished apple letters, reaction faces, stage questions, stars, keyboard controls, on-screen direction buttons, and mobile tap steering.

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

- Stage 1 is A-Z alphabet collection.
- Stages 2-50 are English-learning word-finding missions with 3, 4, 5, and 6-letter words.
- Mobile players can tap around the snake on the play area to turn up, down, left, or right.
- The top progress bar shows completed letters or words for the current stage.
- The root `index.html` is the recommended playable game.
- Legacy stage pages remain in `stages/` for reference.
- The pace slider stores the selected pace in browser local storage.
