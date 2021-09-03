<script>
	import { onMount } from 'svelte';
	import { addMessages, init } from "svelte-i18n";
	import 'esri-leaflet-geocoder/dist/img/search.png'

	import UrlUpdater from '../lib/components/UrlUpdater.svelte';
	import Overlay from '../lib/components/Overlay/Overlay.svelte';

	import en from "../lang/en.json";
	import ru from "../lang/ru.json";

	addMessages("en", en);
	addMessages("ru", ru);

	init({ initialLocale: "en", });

	let Map;
	let startScreen = false;
	let shouldSendEvent = false;

	onMount(async () => {
		const module = await import('../lib/components/Map/Map.svelte');
		Map = module.default;
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="src/styles/restyle_external.css">
	<title>Welcome to Measureland</title>
</svelte:head>

<!-- // subsribe to certain changes and update url -->
<UrlUpdater />

<svelte:component this={Map}/>

<!-- // popup and sidebar layers inside -->
<Overlay />

{#if startScreen}
	<!-- <StartScreen /> -->
{/if}

{#if shouldSendEvent}
	<!-- handle errors and sending -->
	<!-- <ErrorLayer /> -->
{/if}
