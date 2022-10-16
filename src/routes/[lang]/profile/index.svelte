<script>
	import { _, locale } from "svelte-i18n";

	import "/static/styles/general.css";
	import "/static/styles/temp-general.css";

	import RatingCard from "./components/_RatingCard.svelte";
	import SEO from "$lib/components/SEO/SEO.svelte";

	import { userStateStore } from "../../../stores/state.js";
	import { logError, showSomethingWrongNotification, truncateString } from "$lib/utilities/helpers.js";
	import { fetchRatedPlaces } from "$lib/utilities/api.js";
	import { getApproximateAddressAndCountry } from "$lib/utilities/externalApi.js";
	import { onMount } from "svelte";

	let currentTab = "ratings";
	let isLoading = true;
	let ratings = null;
	const token = "pk.eyJ1Ijoicm9tYW5pc3RoZXJlIiwiYSI6ImNrc3E2cjYyMTA5eXkyeG5xZXpkcTI0dnUifQ.Bm8W-u4ylJZTzs3sNFu91w";

	const fetchData = async () => {
		const { error, data } = await fetchRatedPlaces();

		if (error) {
			logError(error);
			showSomethingWrongNotification();
			isLoading = false;
			return;
		}

		const { places, pois, poiComments } = data;

		ratings = await Promise.all(places.map(async ({ location, ratingObj }) => {
			const { ratingID, timeline, comment } = ratingObj;
			const { coordinates } = location;
			const [ lng, lat ] = coordinates;

			// const { address } = await getApproximateAddressAndCountry(lat, lng, $locale);
			const addressStream = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&language=${$locale}&types=country,place,address`);
			const { features } = await addressStream.json();
			const title = `${features[0].text}, ${features[0].address}`;
			const subtitle = `${features[1].text}, ${features[2].text}`;

			return ({
				lat,
				lng,
				title,
				subtitle,
				ratingID,
				timeline,
				comment,
			});
		}));

		isLoading = false;
	};

	onMount(fetchData);
</script>

<!--<SEO-->
<!--	pageTitle={$_("commuinty.titleSEO")}-->
<!--	description={$_("commuinty.descriptionSEO")}-->
<!--	imageSrc='https://measureland.org/images/preview/community_{$locale}_150.jpg'-->
<!--	isSquareImage={false}-->
<!--	imageAltText={$_("SEO.imageAltText")}-->
<!--	isApp={false}-->
<!--/>-->

<div class="mx-auto max-w-[74rem] pt-24 px-12">
	<h1 class="text-8xl tracking-tighter mb-8">
		{$userStateStore.userName}
	</h1>

	{#if currentTab === "ratings"}
		<ul class="flex flex-wrap -mx-2">
			{#if isLoading}
				Loading
			{:else if ratings}
				{#each ratings as { title, subtitle, ratingID, lat, lng, comment }}
					<li class="w-88 m-2 my-3">
						<RatingCard
							title={title}
							subtitle={subtitle}
							content={comment && truncateString(comment, 37)}
						/>
					</li>
				{/each}
			{:else}
				No ratings, sorry
			{/if}
		</ul>
	{:else if currentTab === "pois"}
		something else
	{/if}
</div>