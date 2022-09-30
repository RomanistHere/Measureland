<script>
	import Arrow from "$lib/components/inline-images/Arrow.svelte";

	export let href = "#";
	export let textSmall = "";
	export let textBig = "";
	export let blank = null;

	const target = blank ? "_blank" : null;
	const rel = blank ? "noopener" : null;

	let customClass = "";
	export { customClass as class };
</script>

<a
	{href}
	{target}
	{rel}
	class="flex justify-between items-center p-3 py-3 text-[#7468AC] rounded-lg bg-gradient-to-br from-[#F4EEFF] to-[#F6F7FF] {customClass}"
>
	<div>
		<span class="block text-xs mt-1">
			{textSmall}
		</span>
			<span class="text-2xl font-semibold -mt-1 block tracking-tight">
			{textBig}
		</span>
	</div>
	<div class="arrow transition-transform">
		<Arrow fill="#D9D0FE"/>
	</div>
</a>

<style>
	a:hover .arrow {
		transform:translateX(-6px);
	}
</style>