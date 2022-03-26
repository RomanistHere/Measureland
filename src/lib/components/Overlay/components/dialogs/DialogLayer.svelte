<script>
	import { fade } from 'svelte/transition';
	import { focusTrap } from 'svelte-focus-trap';

	import CloseButton from '../../../ui-elements/CloseButton.svelte';

	import OnMapClickDialog from './OnMapClickDialog.svelte';
	import ReportReasonDialog from './ReportReasonDialog.svelte';

	export let dialogName;
	export let dialogData;

	const dialogList = {
		onMapClickDialog: OnMapClickDialog,
		reportReasonDialog: ReportReasonDialog,
	};

	$: Dialog = dialogList[dialogName];
</script>

<div
	class="dark-glass z-5 inset-0 fixed flex justify-center items-center"
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
		background-color: rgb(255, 255, 255); /* Fallback color */
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		background-color: rgba(255, 255, 255, 0.1);
	}
</style>
