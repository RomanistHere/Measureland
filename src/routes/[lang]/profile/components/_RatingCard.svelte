<script>
	export let title = "";
	export let subtitle = "";
	export let content = null;
</script>

<a
	href={"#"}
	class="rounded-xl bg-bg_gray p-4 py-6 block"
	on:click
>
	<p>
		{title}
	</p>
	<p class="text-sm text-txt_secondary mb-4">
		{subtitle}
	</p>

	{#if content}
		<div
			class="bg-white rounded-md p-4 text-2xl"
		>
			{content}
		</div>
	{/if}
</a>