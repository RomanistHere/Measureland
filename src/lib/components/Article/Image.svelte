<script>
	export let src = "";
	export let alt = "Sorry, we didn't specify alt tex";
	export let caption = null;
</script>

<figure class="w-full mb-4">
	<img
		src="/images/{src}"
		{alt}
		width="690"
	>
	{#if caption}
		<figcaption class="text-center text-sm mt-2">
			{caption}
		</figcaption>
	{/if}
</figure>
