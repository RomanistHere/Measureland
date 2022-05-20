<script>
	import { createEventDispatcher } from "svelte";

	import RadioButton from "./RadioButton.svelte";

	export let firstVal = "";
	export let secondVal = "";
	export let thirdVal = "";
	export let fourthVal = "";
	export let fifthVal = "";
	export let isExpandableLast = false;

	let radioGroupVal = null;
	let isLastInputChecked = false;

	const dispatch = createEventDispatcher();

	const inputOnChange = e => {
		radioGroupVal = e.detail;

		if (radioGroupVal === fifthVal) {
			isLastInputChecked = true;
		} else if (radioGroupVal !== fifthVal) {
			isLastInputChecked = false;
		}

		dispatch("input", radioGroupVal);
	};

	$: isExpanded = isExpandableLast && isLastInputChecked;
</script>

<div class="mb-6">
	<RadioButton
		value={firstVal}
		group={radioGroupVal}
		on:change={inputOnChange}
	/>

	<RadioButton
		value={secondVal}
		group={radioGroupVal}
		on:change={inputOnChange}
	/>

	{#if thirdVal}
		<RadioButton
			value={thirdVal}
			group={radioGroupVal}
			on:change={inputOnChange}
		/>
	{/if}

	{#if fourthVal}
		<RadioButton
			value={fourthVal}
			group={radioGroupVal}
			on:change={inputOnChange}
		/>
	{/if}

	{#if fifthVal}
		<RadioButton
			value={fifthVal}
			group={radioGroupVal}
			on:change={inputOnChange}
		/>
	{/if}

	{#if isExpanded}
		<slot />
	{/if}
</div>
