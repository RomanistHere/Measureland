const config = {
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool',
	},

	remarkPlugins: [],
	rehypePlugins: [],

	layout: {
		article: "./src/lib/components/Blog/Article/Article.svelte",
	}
};

export default config;
