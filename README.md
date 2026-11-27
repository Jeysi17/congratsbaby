# A Letter, Left for You

An interactive sunset-park experience: a paper airplane drifts through the park, unfolds into a handwritten letter, and then a vintage music player is left for the visitor.

The whole project is **one file**: `golden-hour-letter.html`. There is no build step and no npm dependencies.

## Features

- Animated sunset park (SVG): swaying trees and grass, drifting leaves and dust motes, birds, strollers, a picnic, and slowly dimming light.
- A paper airplane that wanders the scene. Clicking it morphs the folded plane into a flat sheet, with the creases visible throughout.
- A letter on textured paper, with handwritten type and a signature.
- A music player that drifts down on a beam of light. It has play and pause, a seek bar, current time, total duration, volume, and an error message on the screen.
- A "Read the letter again" button that swaps between the letter and the player.
- Quiet ambient park sound (wind and birds), generated in the browser.
- Keyboard support, labeled controls, 44px touch targets, and reduced-motion support.

## Technologies

- HTML, CSS, vanilla JavaScript, inline SVG.
- Web Audio API (ambient sound and the demo song) and the HTML `Audio` element (player).
- Google Fonts: Caveat, La Belle Aurore, VT323. If the fonts fail to load, system fallbacks are used. The page needs an internet connection only for these fonts.

## Prerequisites

A modern browser (Chrome, Edge, Safari, Firefox). Optional: Python 3 or Node.js if you want a local server.

## Run it

Option 1: double-click `golden-hour-letter.html`.

Option 2, with a local server (needed if you load your own song from a folder, since some browsers restrict local files):

```bash
python3 -m http.server 8000
# open http://localhost:8000/golden-hour-letter.html
```

There is no production build. The file is already production-ready.

## Folder structure

```
golden-hour-letter.html   the entire experience (CSS, SVG, JS)
README.md                 this file
assets/song.mp3           (you create this) your own song, optional
```

## Customize

All edits are in `golden-hour-letter.html`. Search for the quoted names below.

**Letter and signature.** Find `const LETTER`. Change `greeting`, `paragraphs` (one string per paragraph), `closing`, `signature`, and `next` (the button text under the letter). No animation code needs to change.

**Song.**
1. Create an `assets` folder next to the HTML file and put your song in it, e.g. `assets/song.mp3`.
2. In `const PLAYER`, set `src:"assets/song.mp3"`.
3. Set `title` and `artist` to show on the player screen.

While `src` is `null`, the page plays a short demo tune that it generates itself.

**Player look.** Styles start at `.dev` in the CSS: body colors in `.dev`, screen in `.lcd`, dial in `.wheel`, play button in `#play`. The model name on the body is the text `GOLDEN-HOUR 2` in the HTML.

**Ambient sound.** It always plays and starts on the visitor's first click or tap, because browsers block sound before that. Find `ac.master.gain.setTargetAtTime(.45,...)`: lower the number for quieter, raise it for louder. Bird loudness is the `.07` in the `linearRampToValueAtTime` line. To remove ambient sound entirely, delete the last three lines of the script (`startAmb` and its `addEventListener`).

**Park background.** The scene is the `<svg id="park">` near the top of the body. Colors are in the `sky` and `sun` gradients and in the `fill` values of the hills and trees. Sway speeds are the `.sway`, `.canopy` and `.blade` rules in the CSS. Leaf and mote counts are the two loops in the first script section.

**Birds, strollers, picnic.** Birds are the list inside `$('birds').innerHTML` (each entry is height, speed in seconds, start offset). Strollers are in `$('walkers').innerHTML`: each `walk` group has a duration, a start offset, and `person(...)` calls for size, color and position. The picnic is the `<g id="picnic">` block in the SVG.

**Paper airplane shape and unfolding.** `PLANE` holds the four folded facets and `SHEET` the four flat quadrants. Each facet is four x,y points. `C0` and `C1` are the facet colors before and after unfolding. The unfold duration is `D` inside `openPaper` (milliseconds). The wing-then-keel stagger is the `i*.45` inside `draw`.

**How the plane wanders.** The `fx` and `fy` functions set its path. Smaller amplitudes (the `26` and `13`) keep it closer to center, and larger multipliers inside `Math.sin(...)` make it faster.

**The handoff.** A person physically handing over the player was not built. Instead the player floats down on a beam of light (`#beam`, `#pl`). The timing is in the `setTimeout` calls inside the `$('next')` click handler.

## Deploy

Upload `golden-hour-letter.html` (and your `assets` folder, if you use one) to any static host: Netlify, Vercel, GitHub Pages, Cloudflare Pages, or any web server. Rename the HTML file to `index.html` if you want it to load at the site's root address.

## Troubleshooting

- **No sound until I click:** expected. Browsers require interaction before audio.
- **Ambient sound is too quiet or loud:** change the `.45` value described above.
- **My song doesn't load:** the screen shows "Can't load song". Check the path in `src`, use a `.mp3`, `.wav` or `.ogg` file, and run through a local server.
- **Handwriting looks plain:** the Google Fonts did not load (offline or blocked). The page still works.
- **Animation feels heavy on an old phone:** reduce the leaf and mote counts (`i<26` and `i<7`) and the grass blades (`i<110`).
- **Nothing moves:** the device has "reduce motion" turned on, which the page respects.

## Known limits

- Not tested on every browser or device. Please check on your own phone and desktop before sharing.
- The park is hand-drawn SVG, and the people are simple silhouettes.
