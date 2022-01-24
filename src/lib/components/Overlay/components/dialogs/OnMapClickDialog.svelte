<script>
	import { _ } from 'svelte-i18n';

	import { closeOverlay, openAnotherOverlay } from "$lib/utilities/helpers.js";

	export let dialogData;

	const openPopup = item => {
		closeOverlay('dialog');
		openAnotherOverlay(item, dialogData);
	};
</script>

<h3 class="text-2xl -md:text-lg">
	{$_('onMapClickDialog.title')}
</h3>

<div class="flex -mx-1 mt-4">
	<a
		href={'#'}
		class="block w-1/2 text-center rounded-md border border-black p-2 px-4 mx-1 transition-colors"
		on:click|preventDefault|stopPropagation={() => { openPopup('quizPopup') }}
	>
		<div class="text-center">
			<img
				src="/images/rating_icon.svg"
				alt={$_('onMapClickDialog.option1Alt')}
				class="h-24 inline-block my-2"
			>
		</div>
		{$_('onMapClickDialog.option1')}
	</a>
	<a
		href={'#'}
		class="block w-1/2 text-center rounded-md border border-black p-2 px-4 mx-1 transition-colors"
		on:click|preventDefault|stopPropagation={() => { openPopup('addPOIPopup') }}
	>
		<div class="text-center">
			<img
				src="/images/attention.svg"
				alt={$_('onMapClickDialog.option2Alt')}
				class="h-24 inline-block my-2"
			>
		</div>
		{$_('onMapClickDialog.option2')}
	</a>
</div>

<style>
	@media (hover: hover) and (pointer: fine) {
		a:hover {
			background-color: var(--active-color);
			color: var(--side-bg-color);
		}

		img {
			transition: transform ease .5s;
		}

		a:hover img {
			transform: translateY(-5px);
		}
	}
</style>
