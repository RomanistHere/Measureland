<script>
	import { fade } from 'svelte/transition';
	import { focusTrap } from 'svelte-focus-trap';

	import CloseButton from '../../../ui-elements/CloseButton.svelte';

	import OnMapClickDialog from './OnMapClickDialog.svelte';
	import { closeOverlay } from "$lib/utilities/helpers.js";

	export let dialogName;
	export let dialogData;

	const closeDialog = () => closeOverlay('dialog');

	const dialogList = {
		onMapClickDialog: OnMapClickDialog,
	};

	$: Dialog = dialogList[dialogName];
</script>

<div
	class="dark-glass z-5 inset-0 fixed flex justify-center items-center"
	on:click={closeDialog}
	use:focusTrap
	transition:fade
>
	<div class="glassmorphism max-w-lg p-8 -md:px-4">
		<svelte:component this={Dialog} { dialogData }/>
		<CloseButton overlayType='dialog' className='-md:top-3 -md:right-3' />
	</div>
</div>

<style>
	.dark-glass {
		background-color: rgb(0,0,0); /* Fallback color */
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>
