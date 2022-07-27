<script>
	export let title = "";
	export let bodyHtml = "";
	export let author = "";
</script>

<article class="leading-6">
	<h1 class="text-4xl mb-4">{title}</h1>

	{@html bodyHtml}

	<p class="text-center text-sm text-txt_secondary">Прислал: {author}</p>
</article>

<style>
	article :global(p) {
		margin-bottom: 27px;
	}

	article :global(img) {
		margin-bottom: 27px;
	}
</style>
