<script>
	export let title = "";
	export let bodyHtml = "";
	export let author = "";
</script>

<article class="leading-6">
	<h1 class="text-4xl mb-4">{title}</h1>

	{@html bodyHtml}

	<p class="text-center text-sm text-txt_secondary">Автор: {author}</p>
</article>

<style>
	article :global(p) {
		margin-bottom: 27px;
	}
	article :global(h2) {
		font-size: 18px;
		margin-bottom: 11px;
	}

	article :global(img) {
		margin-bottom: 27px;
	}
</style>
