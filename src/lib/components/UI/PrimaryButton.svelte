<script>
	export let text = "";
	export let disabled = false;

	let customClass = "";
	export { customClass as class };
</script>

<button
	class="hoverable-prim bg-main text-white p-2 px-4 rounded-lg {customClass}"
	class:cursor-default={disabled}
	class:opacity-60={disabled}
	on:click
>
	{text}
</button>
