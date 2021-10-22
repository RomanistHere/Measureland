<script context="module">
    import { getSingleInstance } from '../../../../markdown/prepareMarkdown.js';

    export function load({ page }) {
    	const { lang, slug, blogOrGuides } = page.params;
    	const neededPost = getSingleInstance(blogOrGuides, lang, slug);

    	if (!neededPost) {
    		return {
    			error: 'No page found. Try switching to another language',
    			status: 404,
    		};
    	}

    	return {
    		props: {
    			content: neededPost.postData.default,
    		},
    	};
    }
</script>

<script>
    export let content;
</script>

<svelte:component this={content}/>
