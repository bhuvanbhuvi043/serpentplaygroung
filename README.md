# Serpent Playground Word

Serpent Playground Word is a mobile-first word-finder snake game. Players guide a snake, collect letter apples, build hidden English words, earn stars and limited coins, unlock stages, and use paid clues when they need help.

Version: 1.0.0

Live game: https://bhuvanbhuvi043.github.io/serpentplaygroung/

## Features

- 50 secret word-finding stages.
- Mobile tap steering across the game surface, plus keyboard controls on desktop.
- Smooth wrap-around snake movement; only body collision ends the run.
- Snake body letters and highlighted found-word groups.
- Repeating stage letter banks so the same letters keep respawning after apples are eaten.
- Stage cards with star unlock requirements.
- Percentage progress, stage stars, limited coin rewards, and 5-coin clues.
- Reaction emojis, generated background music, and browser speech for snake voice.
- Responsive phone layout with a taller 20 by 26 play board.
- Custom Serpent Playground Word logo and active board artwork.

## Folder Structure

```text
.
|-- assets/
|   `-- images/         Logo and active board backgrounds
|-- src/
|   |-- js/
|   |   `-- perfect-game.js
|   `-- styles/
|       `-- perfect-game.css
|-- index.html          Playable game
|-- package.json        Local static-server script
|-- privacy.html        Privacy policy for Play Store listing
|-- PLAY_STORE_CHECKLIST.md
|-- COPYRIGHT.md
`-- LICENSE
```

## Run Locally

From the project root:

```bash
npm start
```

Then open:

```text
http://localhost:8080
```

You can also run any static web server from this folder, because the game is a browser-only HTML, CSS, and JavaScript project.

## Gameplay Notes

- Target words stay hidden until the player finds them.
- Completed stage cards show the words already discovered.
- Stage 1 starts with the letters `E N D T`, allowing words such as `END`, `NET`, and `TEN`.
- Clues highlight the next useful letter and cost 5 coins.
- Coins are intentionally limited so clues stay valuable.
- Sound and snake speech start enabled and can be muted from the mission drawer.

## Copyright And License

Copyright (c) 2026 bhuvanbhuvi043. Released under the BSD 2-Clause License. See [LICENSE](LICENSE) and [COPYRIGHT.md](COPYRIGHT.md).

## Android Release

The Android project is in `android/`. Release APK/AAB files are generated into `outputs/android/` and are intentionally not committed to Git.

Use the AAB for Google Play Console and the APK for direct phone testing.
