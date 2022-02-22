<script>
	export let maxCommentLength;
	export let placeholder;
	export let className;

	let ref;

	export const focus = () => {
		ref?.focus();
	};
</script>

<div class="relative">
    <textarea
	    class="w-full h-40 p-2 rounded-md text-base border-2 border-active focus:outline-0 {className}"
	    { placeholder }
	    maxlength={maxCommentLength}
	    on:input
	    bind:this={ref}
    ></textarea>

	<span class="w-3 h-3 rounded-full absolute -left-6 -md:-left-4 top-4 opacity-0 bg-active transition-opacity duration-200 delay-100"></span>
	<span class="w-3 h-3 rounded-full absolute -right-6 -md:-right-4 top-4 opacity-0 bg-active transition-opacity duration-200 delay-100"></span>
</div>

<style>
	textarea:focus + span {
		opacity: 1;
	}

	textarea:focus + span + span {
		opacity: 1;
	}
</style>
