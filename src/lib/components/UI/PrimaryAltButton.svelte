<script>
	export let text = "";

	let customClass = "";
	export { customClass as class };
</script>

<button
	on:click
	class="block text-center border-main border rounded-lg w-full text-main px-8 py-4 leading-5 hoverable-prim {customClass}"
>
	{text}
</button>
