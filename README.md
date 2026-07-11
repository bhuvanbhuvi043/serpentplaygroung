# Word Serpent

Word Serpent is a browser-based word-finder snake game. The root game uses a stage-card menu, a phone-fitted canvas engine, snake body letters, polished apple letters, reaction emojis, percentage-based stars, gold coins, paid clues, keyboard controls, queued mobile tap steering, generated music, and browser speech for the snake voice.

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

- All 50 stages are English-learning word-finding missions built from reusable letter banks.
- Stage 1 uses `E N D T`, so players can build `END`, `NET`, and `TEN`.
- Stage letter banks keep respawning the same letters after each apple.
- Stage unlocks use cumulative stars: Stage 2 needs 1 star, Stage 3 needs 5 stars, and later stages rise gradually.
- Stars are based on percentage of words found before winning or crashing.
- Gold coins are earned from found words and improved stage-star results.
- Clues cost coins and highlight the next useful letter with an arrow.
- Completed word letters are highlighted as color groups on the snake body.
- Mobile players can tap or slide on the game surface to turn up, down, left, or right.
- The game screen uses the real visible phone height so the toolbar stays inside the screen.
- The taller mobile board uses a 20 by 26 grid for more play space.
- The top progress bar shows completed words for the current stage.
- The snake color changes by stage.
- Sound and snake speech are enabled by default, with a Mute button in the Mission drawer.
- The in-game Mission drawer holds stage buttons, clues, collected letters, sound, and pace settings.
- The root `index.html` is the recommended playable game.
- Legacy stage pages remain in `stages/` for reference.
- The pace slider stores the selected pace in browser local storage.
