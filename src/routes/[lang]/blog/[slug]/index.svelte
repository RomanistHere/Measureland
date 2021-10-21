<script context="module">
    const ruPosts = import.meta.globEager(`../../../../posts/ru/*.md`);
    const enPosts = import.meta.globEager(`../../../../posts/en/*.md`);

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
    			content: neededPost.postData.default,
    		},
    	};
    }
</script>

<script>
    import { addMessages, init } from 'svelte-i18n';
    import { page } from '$app/stores';

    export let content;

    import en from '../../../../lang/en.json';
    import ru from '../../../../lang/ru.json';

    const lang = $page.params.lang;

    addMessages('en', en);
    addMessages('ru', ru);

    init({
    	initialLocale: lang,
    	fallbackLocale: 'en',
    });
</script>

<svelte:component this={content}/>
