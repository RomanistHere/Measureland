<script>
	import { createEventDispatcher } from "svelte";

	export let value = '';
	export let group = null;

	const name = Date.now();
	const dispatch = createEventDispatcher();

	const handleChange = () =>
		dispatch('change', value);
</script>

<div class="my-3">
	<input
		id="id_{value}"
		type="radio"
		class="hidden"
		{name}
		{value}
		bind:group
		on:change={handleChange}
	/>
	<label for="id_{value}" class="flex items-center cursor-pointer">
		<span class="w-5 h-5 inline-block rounded-md border border-text transition-colors shrink-0 mr-3"></span>
		{value}
	</label>
</div>

<style>
	input[type="radio"]:checked + label span {
		background-color: var(--active-color);
		box-shadow: 0px 0px 0px 2px white inset;
	}

	input[type="radio"]:checked + label{
		color: var(--active-color);
	}
</style>
