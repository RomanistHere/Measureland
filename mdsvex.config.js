const config = {
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool',
	},

	remarkPlugins: [],
	rehypePlugins: [],

	layout: {
		article: "./src/lib/components/Article/Article.svelte",
	}
};

export default config;
