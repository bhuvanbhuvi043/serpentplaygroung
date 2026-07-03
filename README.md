# Word Serpent

Word Serpent is a browser-based word and snake game. The player guides the snake through letter-based challenges, earns stars for each stage, and unlocks the next implemented level after earning enough stars.

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
|-- stages/             Stage 1 through Stage 7 pages
|-- index.html          Game home screen
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
- The old empty stage 8-10 placeholders were removed so players do not navigate into blank pages.
- The stage speed slider stores the selected speed in browser local storage and the stages read it when they start.
