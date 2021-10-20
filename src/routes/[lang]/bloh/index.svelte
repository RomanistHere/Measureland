<script context="module">
    const ruPosts = import.meta.globEager(`../../../posts/ru/*.md`);
const enPosts = import.meta.globEager(`../../../posts/en/*.md`);
let posts = {
    	'ru': [],
    	'en': [],
    };

for (const path in enPosts) {
	const postData = enPosts[path];
	const { slug } = postData.metadata;
	const post = { postData, slug };
    	posts = {
    		...posts,
    		'en': [ ...posts.en, post ],
    	};
}

for (const path in ruPosts) {
	const postData = ruPosts[path];
	const { slug } = postData.metadata;
	const post = { postData, slug };
    	posts = {
    		...posts,
    		'ru': [ ...posts.ru, post ],
    	};
}

export function load({ page }) {
	const { lang } = page.params;
	const postsArray = posts[lang];

    	if (!postsArray) {
    		return {
    			error: 'No posts found. Try switching to another language',
    			status: 404,
    		};
    	}

	return {
		props: {
    			postsArray,
		},
	};
}
</script>

<script>
    export let postsArray;

    console.log(postsArray);
</script>

<!-- <svelte:component this={postsArray}/> -->
