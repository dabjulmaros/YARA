# Y.et A.nother R.eddit A.pp

I have been working on this app for maybe 6 months. Nothing fancy just a Svelte app trying to play with the Reddit Api (Rip), and svelte.
Due to recent changes with Reddit policies I have decided to make the project public and start scraping old reddit.

Laundry List of things that need to be improved:

- move from old reddit to new reddit
- add customization
- figure out how to use the electron updater
  - The app builds correctly now, but is still under heavy development.
  - I still want to commit updates as they are done instead of realasing built updates.
- make it so videos and other media is not redered while outside of view
- general improvements everywhere

What it does right now.

- Simple UI that doesnt make me want to pull my eyes out
- Responsive wide and narrow UI
- Videos, images, galleries, text post, and iframe all are being rendered
- Link posts are clickable to the source
- Allow to opt into content tagged as NSFW
- View the home page, communities, post, users, and search.
- Uses Electron headers to pass cors requirements
- app builts correctly
- videos will autoplay when the user scrolls them into view, and pause when out

## Current TODO:

- Implement:
  - https://www.npmjs.com/package/electron-tabs
  - This is not looking good may need to develop from scratch
    - https://www.npmjs.com/package/electron-in-page-search
- Find the right values to center in the view the post when viewing comments `InlineComments.svelte:67`
- Add a drop down to the nav bar that changes between the different modes.
  - specifically, that it takes away the need to type `search/` when trying to search

As to why I'm using Electron for this application and not deploying it in a site somewhere... I wanted to use YARA as the name, and by being an electron app I can use app as the A.

I'm working on this as I use it, so for now the development plan is "If I experience an issue or incovenience I will work on it". I know very professional, but hey at least I know Im working on issues that matter.

----------------------------------------

## Made using: Sveltekit + Electron

Minimal [Sveltekit](https://github.com/sveltejs/kit#readme) + [Electron](https://www.electronjs.org/) starter [template](https://github.com/FractalHQ/sveltekit-electron).

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
