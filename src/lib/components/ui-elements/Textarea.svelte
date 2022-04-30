<script>
	import { createEventDispatcher } from "svelte";

	export let maxlength;
	export let placeholder = '';
	export let className = '';

	let ref;
	let remainingCommentLength = maxlength;

	$: isRemainingCharsWarning = remainingCommentLength / maxlength < .05;

	const dispatch = createEventDispatcher();

	const handleInput = e => {
		const { value } = e.target;
		remainingCommentLength = maxlength - value.length;
		dispatch('input', value);
	};

	export const focus = () => {
		ref?.focus();
	};
</script>

<div class="relative">
    <textarea
	    class="w-full h-40 p-2 rounded-md text-base border-2 border-active focus:outline-0 {className}"
	    { placeholder }
	    { maxlength }
	    on:input={handleInput}
	    bind:this={ref}
    ></textarea>

	<span class="w-3 h-3 rounded-full absolute -left-6 -md:-left-4 top-4 opacity-0 bg-active transition-opacity duration-200 delay-100"></span>
	<span class="w-3 h-3 rounded-full absolute -right-6 -md:-right-4 top-4 opacity-0 bg-active transition-opacity duration-200 delay-100"></span>
</div>

<p class:text-orange-400={isRemainingCharsWarning}>
	{remainingCommentLength}
</p>

<style>
	textarea:focus + span {
		opacity: 1;
	}

	textarea:focus + span + span {
		opacity: 1;
	}
</style>
