<script>
	export let src = "";
	export let alt = "Sorry, we didn't specify alt tex";
	export let caption = null;

	const webpSrc = `${src.split('.')[0]}.webp`;
</script>

<figure class="w-full mb-4">
	<a href="/images/{src}" target="_blank" class="cursor-zoom-in">
		<picture>
			<source
				type="image/webp"
				srcset="/images/webp/{webpSrc}"
			>
			<img
				src="/images/{src}"
				{alt}
				width="690"
				loading="lazy"
			>
		</picture>
	</a>
	{#if caption}
		<figcaption class="text-center text-sm mt-2">
			{caption}
		</figcaption>
	{/if}
</figure>
