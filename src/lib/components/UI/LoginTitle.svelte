<script>
	export let title;

	let customClass = "";
	export { customClass as class };
</script>

<h2 class="text-5xl mb-6 tracking-tighter mt-4 {customClass}">
	{title}
</h2>
