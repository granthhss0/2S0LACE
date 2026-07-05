# 2S0LACE

A clean, glass-styled home for unblocked HTML5 games. Static site, no build step — works directly on GitHub Pages.

## Structure

```
2S0LACE/
├── index.html            Home page
├── games.html            Games catalog + player
├── media.html            Media page (placeholder)
├── settings.html         Settings page (placeholder)
├── games-list.json       ← the games database. Edit this to add/remove games.
├── games/
│   └── sample-game/      One folder per game, each with its own index.html
│       └── index.html
├── assets/
│   ├── css/              tokens.css (design system), nav.css, home.css, games.css
│   └── js/                nav.js (shared nav), games.js (catalog logic)
└── .nojekyll             Tells GitHub Pages not to run Jekyll processing
```

## Adding a new game

1. Make a folder under `games/` named after your game, e.g. `games/space-runner/`.
2. Put the game's files inside it. It needs an `index.html` entry point; any other assets (JS, images, sounds) can live alongside it in that same folder.
3. Add an entry to `games-list.json`:

```json
{
  "id": "space-runner",
  "title": "Space Runner",
  "description": "A short one- or two-sentence description shown on the card.",
  "path": "games/space-runner/index.html",
  "thumbnail": "games/space-runner/thumb.png",
  "controls": "Arrow keys to steer, Space to boost",
  "added": "2026-07-05",
  "featured": false
}
```

- `thumbnail` is optional — leave it `""` to show an auto-generated glass placeholder tile.
- `featured: true` adds a small badge to the card.

That's it — no code changes needed. The games page reads `games-list.json` on load and renders everything from it.

## Removing the sample game

`games/sample-game/` and its entry in `games-list.json` are just there to show the expected shape and to prove the player view works. Delete the folder and remove the JSON entry whenever you're ready to replace it with real games.

## Placeholder pages

`settings.html` and `media.html` are intentionally empty shells right now — same nav, same glass placeholder card, different copy. Build these out later without touching the other pages.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**, pick your default branch and `/ (root)`.
4. Save. Your site will be live at `https://<username>.github.io/2S0LACE/`.

The `.nojekyll` file at the root is required — without it, GitHub's Jekyll processor may ignore folders/files starting with underscores and can interfere with asset paths.
