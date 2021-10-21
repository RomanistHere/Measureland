<script context="module">
    const ruPosts = import.meta.globEager(`../../../posts/ru/*.md`);
    const enPosts = import.meta.globEager(`../../../posts/en/*.md`);
    let posts = {
    	'ru': [],
    	'en': [],
    };

    for (const path in enPosts) {
    	const postData = enPosts[path];
    	const { metadata } = postData;
    	posts = {
    		...posts,
    		'en': [ ...posts.en, metadata ],
    	};
    }

    for (const path in ruPosts) {
    	const postData = ruPosts[path];
    	const { metadata } = postData;
    	posts = {
    		...posts,
    		'ru': [ ...posts.ru, metadata ],
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
    import { addMessages, init } from 'svelte-i18n';
    import { page } from '$app/stores';

    import Blog from '../../../lib/components/Blog/Blog.svelte';

    export let postsArray;

    import en from '../../../lang/en.json';
    import ru from '../../../lang/ru.json';

    const lang = $page.params.lang;

    addMessages('en', en);
    addMessages('ru', ru);

    init({
    	initialLocale: lang,
    	fallbackLocale: 'en',
    });
</script>

<Blog {postsArray} />
