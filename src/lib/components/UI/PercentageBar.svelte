<script>
	export let text = null;
	export let value = 0;

	let customClass = "";
	export { customClass as class };

	$: dynamicWidth = `--width: ${value}%`;
</script>

<style>
	.dynamicWidth {
        width: var(--width);
	}
</style>

<div class="flex justify-center items-center w-full h-10 relative rounded-lg bg-[#232A38] {customClass}">
	<div
		class="dynamicWidth bg-main absolute inset-0 rounded-lg"
		style={dynamicWidth}
	></div>
	<span class="z-2">{text}</span>
</div>

