<script>
	export let text = "";

	let customClass = "";
	export { customClass as class };
</script>

<button
	class="w-full p-3 px-4 bg-bg_gray hover:bg-bg_slate transition-colors text-txt_main rounded-lg font-medium {customClass}"
	on:click
>
	{text}
</button>