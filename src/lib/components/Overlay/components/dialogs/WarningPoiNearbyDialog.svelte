<script>
	import { _ } from 'svelte-i18n';

	import { closeOverlay, openAnotherOverlay } from "$lib/utilities/helpers.js";

	export let dialogData;

	$: numberOfPois = dialogData.closePointsData.length;

	const addNewPOI = () => {
		closeOverlay('dialog');
		openAnotherOverlay('addPOIPopup', dialogData.latlng);
	};

	const openPOI = () => {
		const [ lng, lat ] = dialogData.closePointsData[0].geometry.coordinates;
		closeOverlay('dialog');
		openAnotherOverlay('pointOfInterestPopup', { lat, lng });
	};
</script>

<h3 class="text-2xl -md:text-lg pr-6">
	{$_('warningPoiNearbyDialog.title')}
</h3>

<p class="mt-2">
	{
		numberOfPois > 1
			? $_('warningPoiNearbyDialog.multipleDesc', { values: { numberOfPois } })
			: $_('warningPoiNearbyDialog.singleDec')
	}
</p>

<p>
	{$_('warningPoiNearbyDialog.desc')}
</p>

<div class="flex -mx-1 mt-4">
	<a
		href={'#'}
		class="flex items-center justify-center w-1/2 text-center rounded-md border border-black p-2 px-4 mx-1 transition-colors hover:bg-active hover:text-white"
		on:click|preventDefault|stopPropagation={openPOI}
	>
		{$_('warningPoiNearbyDialog.button1')}
	</a>
	<a
		href={'#'}
		class="flex items-center justify-center w-1/2 text-center rounded-md border border-black p-2 px-4 mx-1 transition-colors hover:bg-active hover:text-white"
		on:click|preventDefault|stopPropagation={addNewPOI}
	>
		{$_('warningPoiNearbyDialog.button2')}
	</a>
</div>
