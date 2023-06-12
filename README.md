# Y.et A.nother R.eddit A.pp

I have been working on this app for maybe 6 months. Nothing fancy just a Svelte app trying to play with the Reddit Api (Rip), and svelte.
Due to recent changes with Reddit policies I have decided to make the project public and start scraping old reddit.

Laundry List of things that need to be improved:

- Server implementation to avoid cors errors
- move from old reddit to new reddit
- add support for galleries
- add customization
- fix UI issues introduced by electron
- general improvements everywhere

What it does right now.

- Simple UI that doesnt make me want to pull my eyes out
- Videos, images, text post, and iframe all are being rendered


# Made using: Sveltekit + Electron

Minimal [Sveltekit](https://github.com/sveltejs/kit#readme) + [Electron](https://www.electronjs.org/) starter [template](https://github.com/FractalHQ/sveltekit-electron).


<br />

## Getting Started

Unfortunately you must use `npm` as there are issues that arise when using `pnpm` or `yarn`

|         |                                             |
| ------- | ------------------------------------------- |
| Clone   | · `npx degit fractalhq/sveltekit-electron ` |
| Install | · `npm install`                             |
| Develop | · `npm run dev`                             |
| Build   | · `npm run build`                           |

In order to eliminate vulnerabilities caused by electron itself, please run `npm update` and `npm audit fix`. This will apply overrides.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Svelte for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

## Change Build Targets

In the scripts section of package.json you can update the `build:electron` command and change the flags to set the targets, by default it uses `-mwl` which is Mac, Windows, and Linux
