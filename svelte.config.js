import preprocess from "svelte-preprocess";
/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';

const handleError = ({ status, path, referrer, referenceType }) => {
	console.warn(`${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`);
};

const config = {
    // ssr: true
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
			pages: [
				'*',
				'/ru',
				'/en'
			],
			onError: handleError
		}
	},

    preprocess: [preprocess({
        postcss: true
    })]
};

export default config;
