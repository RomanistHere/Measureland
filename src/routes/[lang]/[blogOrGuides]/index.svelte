<script context="module">
    import { getArray } from '../../../markdown/prepareMarkdown.js';

    export function load({ page }) {
    	const { lang, blogOrGuides } = page.params;
    	const postsArray = getArray(blogOrGuides, lang);

    	if (!postsArray) {
    		return {
    			error: 'No posts found. Try switching to another language',
    			status: 404,
    		};
    	}

    	return {
    		props: {
    			postsArray,
    			blogOrGuides,
    		},
    	};
    }
</script>

<script>
    import Blog from '../../../lib/components/Blog/Blog.svelte';

    export let postsArray;
    export let blogOrGuides;
</script>

<Blog
    {postsArray}
    {blogOrGuides}
/>
