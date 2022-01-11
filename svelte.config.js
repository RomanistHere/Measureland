import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import preprocess from 'svelte-preprocess';
/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';

const handleError = ({
	status,
	path,
	referrer,
	referenceType,
}) => {
	console.warn(`${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`);
};

const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	// ssr: true
	kit: {
		target: '#svelte',
		adapter: adapter({
			pages: 'dist',
			assets: 'dist',
			fallback: null,
		}),
		prerender: {
			crawl: true,
			enabled: true,
			entries: [ '*', '/ru/', '/en/' ],
			onError: handleError,
		},
		trailingSlash: 'always',
	},

	preprocess: [
		preprocess({
			postcss: true,
		}),
		mdsvex(mdsvexConfig),
	],
};

export default config;
