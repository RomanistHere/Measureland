<script>
	import { onMount } from "svelte";
	import { _, locale } from "svelte-i18n";
	import "esri-leaflet-geocoder/dist/img/search.png";
	import "/static/styles/general.css";
	import "/static/styles/temp-general.css";

	import SEO from "../../lib/components/SEO/SEO.svelte";
	import UrlUpdater from "../../lib/components/UrlUpdater.svelte";
	import ErrorHandler from "../../lib/components/ErrorHandler.svelte";
	import EventsHandler from "../../lib/components/EventsHandler.svelte";
	import Overlay from "../../lib/components/Overlay/Overlay.svelte";

	let Map;

	onMount(async () => {
		const module = await import("../../lib/components/Map/Map.svelte");
		Map = module.default;
	});
</script>

<svelte:head>
	<!-- there are 2 versions of PWA for both languages -->
	<link rel="manifest" href="/{$locale}/manifest.json">
	<meta name="msapplication-starturl" content="/{$locale}/">
	<!-- main page should be "overflowed", and these styles should be unmounted when change page -->
	<style>
		html,
		body,
		#svelte {
			height: 100%;
			overflow: hidden;
		}
	</style>
</svelte:head>

<SEO
    pageTitle={$_("SEO.title")}
    description={$_("SEO.description")}
    imageSrc='https://measureland.org/images/preview/rectangle_{$locale}_150.jpg'
	isSquareImage={false}
	imageAltText={$_("SEO.imageAltText")}
/>

<ErrorHandler />
<EventsHandler />

<UrlUpdater />

<svelte:component this={Map}/>

<Overlay />
