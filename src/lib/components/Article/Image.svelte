<script>
	export let src = "";
	export let alt = "Sorry, we didn't specify alt tex";
	export let caption = null;
</script>

<figure class="w-full mb-4">
	<a href="/images/{src}" target="_blank" class="cursor-zoom-in">
		<img
			src="/images/{src}"
			{alt}
			width="690"
		>
	</a>
	{#if caption}
		<figcaption class="text-center text-sm mt-2">
			{caption}
		</figcaption>
	{/if}
</figure>
