<script>
	export let text = "";

	let customClass = "";
	export { customClass as class };
</script>

<button
	class="hoverable-link text-txt_secondary hover:text-main focus:text-main text-sm {customClass}"
	on:click
>
	{text}
</button>
