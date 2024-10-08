import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
// import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			fallback: 'index.html',
		}),
		alias: {
			$lib: 'src/lib',
		},
		prerender: { entries: [] },
	},
};

export default config;
