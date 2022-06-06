<script>
	import MetamaskIcon from "$lib/components/inline-images/MetamaskIcon.svelte";
	import TelegramIcon from "$lib/components/inline-images/TelegramIcon.svelte";

	export let isRegistration = false;

	const authTelegram = () => {

	};

	const authMetamask = () => {

	};
</script>

<button
	on:click={authTelegram}
	class="relative block text-center py-3 hover:border-new-active text-txt_main border rounded-lg w-full focus:border-new-active transition-colors hover:bg-new-active"
>
		<span class="relative">
			{isRegistration ? "Регистрация" : "Вход"} через Telegram
			<span
				class="absolute top-1/2 transform -translate-y-1/2 -right-6 transition-opacity opacity-0 duration-200"
			>
				<TelegramIcon />
			</span>
		</span>
</button>

<button
	on:click={authMetamask}
	class="relative block text-center py-3 my-2 hover:border-new-active text-txt_main border rounded-lg w-full focus:border-new-active transition-colors hover:bg-new-active"
>
		<span class="relative">
			{isRegistration ? "Регистрация" : "Вход"} через Metamask
			<span
				class="absolute top-1/2 transform -translate-y-1/2 -right-6 transition-opacity opacity-0 duration-200"
			>
				<MetamaskIcon />
			</span>
		</span>
</button>

<style>
	.block:hover .opacity-0 {
		opacity: 1;
	}
</style>
