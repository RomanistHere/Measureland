<script>
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
	<svg class="transition-transform" width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M25.0607 13.0607C25.6464 12.4749 25.6464 11.5251 25.0607 10.9393L15.5147 1.3934C14.9289 0.807611 13.9792 0.807611 13.3934 1.3934C12.8076 1.97919 12.8076 2.92893 13.3934 3.51472L21.8787 12L13.3934 20.4853C12.8076 21.0711 12.8076 22.0208 13.3934 22.6066C13.9792 23.1924 14.9289 23.1924 15.5147 22.6066L25.0607 13.0607ZM0 13.5H24V10.5H0V13.5Z" fill="#D9D0FE"/>
	</svg>
</a>

<style>
	a:hover svg {
		transform:translateX(-5px);
	}
</style>