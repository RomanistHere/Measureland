<script context="module">
    import { getSingleInstance } from "../../../../markdown/prepareMarkdown.js";

    // eslint-disable-next-line func-style
    export function load ({ page }) {
    	const { lang, slug } = page.params;
    	const neededPost = getSingleInstance(lang, slug);

    	if (!neededPost) {
    		return {
    			error: "No page found. Try switching to another language",
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
