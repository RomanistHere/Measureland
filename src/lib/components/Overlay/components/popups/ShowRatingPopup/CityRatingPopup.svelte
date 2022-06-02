<script>
	import { json, _ } from "svelte-i18n";

	import ShowRatingPopupItem from "./ShowRatingPopupItem.svelte";

	import { mapReference } from "../../../../../../stores/references.js";

	export let popupData;

	$: criteriaArray = popupData.ratings === null
		? Object.entries($json("criteria")).map(([ , value ]) => ({ ...value, rating: 0 }))
		: Object.entries(popupData.ratings).map(([ key, value ]) => ({ ...$json("criteria")[key], rating: value }));

	const map = $mapReference;
</script>

<div class="max-w-lg w-full">
	<p class="mb-4 text-center italic text-base font-bold -md:px-10">
		{$_("showRatingPopup.approximateAddress")}: {popupData.name}
	</p>

	<div class="relative">
		<ul>
			{#each criteriaArray as item}
				<ShowRatingPopupItem { ...item } />
			{/each}
		</ul>
	</div>

	<div class="flex justify-between my-4 -md:text-sm">
		<div>
			{$_("showRatingPopup.usersRated")}:
			<span class="sug-col font-bold text-2xl -md:text-lg">{popupData.number}</span>
		</div>
	</div>
</div>
