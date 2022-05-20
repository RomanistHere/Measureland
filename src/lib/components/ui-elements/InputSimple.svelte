<script>
    export let autocomplete;
    export let placeholder;
    export let className = "";
    export let maxlength = null;

    let ref;

    export const focus = () => {
	    ref?.focus();
    };
</script>

<div class="relative">
	<input
		class="mt-4 p-2 w-full rounded-md shadow border-2 border-active focus:outline-0 transition-colors duration-100 {className}"
		type="text"
		{ autocomplete }
		{ placeholder }
		{ maxlength }
		on:change
		bind:this={ref}
	>
	
	<span class="w-3 h-3 rounded-full absolute -left-6 -md:-left-4 top-8 opacity-0 bg-active transition-opacity duration-200 delay-100"></span>
	<span class="w-3 h-3 rounded-full absolute -right-6 -md:-right-4 top-8 opacity-0 bg-active transition-opacity duration-200 delay-100"></span>
</div>

<style>
    input:focus + span {
        opacity: 1;
    }

    input:focus + span + span {
        opacity: 1;
    }
</style>
