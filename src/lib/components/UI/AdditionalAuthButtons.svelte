<script>
	import MetamaskIcon from "$lib/components/inline-images/MetamaskIcon.svelte";
	import TelegramIcon from "$lib/components/inline-images/TelegramIcon.svelte";

	export let isRegistration = false;

	const authTelegram = () => {

	};

	const authMetamask = async () => {
		if (window.web3) {
			try {
				const selectedAccount = await window.ethereum
					.request({
						method: "eth_requestAccounts",
					})
					.then(accounts => {
						console.log(accounts);
						return accounts[0];
					})
					.catch(error => {
						if (error.code === 4001) {
							// EIP-1193 userRejectedRequest error
							console.log('Please connect to MetaMask.');
						} else {
							console.error(error);
						}
					});

				window.userWalletAddress = selectedAccount;
				console.log(selectedAccount);
				window.localStorage.setItem("userWalletAddress", selectedAccount);
			} catch (error) {
				console.warn(error);
			}
		} else {
			console.warn("wallet not found");
		}
	};
</script>

<button
	on:click|preventDefault={authTelegram}
	class="relative block text-center py-3 hover:border-new-active text-txt_main border rounded-lg w-full focus:outline-0 focus:border-new-active transition-colors hover:bg-new-active focus:bg-new-active"
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
	on:click|preventDefault={authMetamask}
	class="relative block text-center py-3 hover:border-new-active text-txt_main border rounded-lg w-full focus:outline-0 focus:border-new-active transition-colors hover:bg-new-active focus:bg-new-active my-2"
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
	.block:hover .opacity-0,
	.block:focus .opacity-0 {
		opacity: 1;
	}
</style>
