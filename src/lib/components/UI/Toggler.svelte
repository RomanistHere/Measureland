<script>
	export let checked = false;

	let customClass = "";
	export { customClass as class };
</script>

<label class="switch {customClass} relative inline-block w-10 h-6">
	<input
		type="checkbox"
		class="opacity-0 w-0 h-0"
		on:change
		{checked}
	>
	<span
		class="round absolute inset-0 bg-txt_secondary transition-colors rounded-2xl"
	>
		<span class="absolute w-5 h-5 left-0.5 bottom-0.5 rounded-full bg-white transition-transform"></span>
	</span>
</label>

<style>
	input:checked + span {
		background-color: var(--main);
	}

	input:checked + span span {
		transform: translateX(1rem);
	}
</style>