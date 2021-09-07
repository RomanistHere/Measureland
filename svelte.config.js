/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';

const handleError = ({ status, path, referrer, referenceType }) => {
	console.warn(`${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`);
};

const config = {
	kit: {
		target: '#svelte',
		adapter: adapter({
			pages: 'dist',
			assets: 'dist',
			fallback: null
		}),
		prerender: {
			crawl: true,
			enabled: true,
			onError: handleError
		}
	},
	// ssr: true
};

export default config;
