<script>
	import "../app.css";

	import { addMessages, init } from 'svelte-i18n';
	import { page } from '$app/stores';

	import en from '../lang/en.json';
	import ru from '../lang/ru.json';

	const lang = $page.params.lang;

	addMessages('en', en);
	addMessages('ru', ru);

	init({
		initialLocale: lang,
		fallbackLocale: 'en',
	});
</script>

<slot></slot>

<style>

</style>
