<script>
	import InputSimple from './InputSimple.svelte';
	import GroupTitle from './GroupTitle.svelte';

	export let title;
	export let placeholder;
	export let autocomplete;
	export let maxlength = null;

	let ref;

	export const focus = () => {
		ref?.focus();
	};
</script>

<div class="relative">
	<GroupTitle { title } />

	<InputSimple
		{ autocomplete }
		{ placeholder }
		{ maxlength }
		on:change
		bind:this={ref}
	/>
</div>
