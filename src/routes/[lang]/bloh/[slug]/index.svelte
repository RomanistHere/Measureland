<script context="module">
    const ruPosts = import.meta.globEager(`../../../../posts/ru/*.md`);
const enPosts = import.meta.globEager(`../../../../posts/en/*.md`);
let posts = {
    	'ru': [],
    	'en': [],
    };

for (const path in enPosts) {
	const postData = enPosts[path];
	const { date, tags, title, description, slug } = postData.metadata;
	const post = { postData, slug };
    	posts = {
    		...posts,
    		'en': [ ...posts.en, post ],
    	};
}

for (const path in ruPosts) {
	const postData = ruPosts[path];
	const { date, tags, title, description, slug } = postData.metadata;
	const post = { postData, slug };
    	posts = {
    		...posts,
    		'ru': [ ...posts.ru, post ],
    	};
}

export function load({ page }) {
	const { slug, lang } = page.params;
	const neededPost = posts[lang].find(p =>
		p.slug.toLowerCase() === slug.toLowerCase());

    	if (!neededPost) {
    		return {
    			error: 'No page found. Try switching to another language',
    			status: 404,
    		};
    	}

	return {
		props: {
    			page: neededPost.postData.default,
			metadata: neededPost.postData.metadata,
		},
	};
}
</script>

<script>
    import '/static/styles/blog.css';

    export let page;
    export let metadata;

    console.log(metadata);
</script>

<svelte:component this={page}/>
