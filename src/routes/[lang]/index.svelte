<script>
	import { onMount } from 'svelte';
	import { addMessages, init, _ } from 'svelte-i18n';
	import { page } from '$app/stores';
	import 'esri-leaflet-geocoder/dist/img/search.png';
	import '/static/styles/general.css';

	import SEO from '../../lib/components/SEO/SEO.svelte';
	import UrlUpdater from '../../lib/components/UrlUpdater.svelte';
	import ErrorHandler from '../../lib/components/ErrorHandler.svelte';
	import EventsHandler from '../../lib/components/EventsHandler.svelte';
	import Overlay from '../../lib/components/Overlay/Overlay.svelte';

	import en from '../../lang/en.json';
	import ru from '../../lang/ru.json';

	const lang = $page.params.lang;

	addMessages('en', en);
	addMessages('ru', ru);

	init({
		initialLocale: lang,
		fallbackLocale: 'en',
	});

	let Map;

	onMount(async() => {
		const module = await import('../../lib/components/Map/Map.svelte');
		Map = module.default;
	});
</script>

<SEO
    pageTitle={$_('SEO.title')}
    description={$_('SEO.description')}
    imageSrc='https://measureland.org/images/PWA-icon-512x512.png'
	imageAltText={$_('SEO.imageAltText')}
/>

<ErrorHandler />
<EventsHandler />

<UrlUpdater />

<svelte:component this={Map}/>

<Overlay />
