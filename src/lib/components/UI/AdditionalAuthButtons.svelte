<script>
	import { locale } from "svelte-i18n";

	import MetamaskIcon from "$lib/components/inline-images/MetamaskIcon.svelte";
	import TelegramIcon from "$lib/components/inline-images/TelegramIcon.svelte";
	import { validateTelegram } from "$lib/utilities/externalApi.js";
	import { authThirdParty } from "$lib/utilities/api.js";
	import { userStateStore } from "../../../stores/state.js";
	import { openAnotherOverlay, logError, closeOverlay } from "$lib/utilities/helpers.js";

	export let isRegistration = false;
	export let handleError = e => logError(e);

	const handleSuccess = data => {
		console.log(data);
		closeOverlay("modal");

		if (data.authType === "login") {
			const { userID, activeRatings, userName, wantMoreRatings } = data;

			userStateStore.update(state => ({
				...state,
				userID,
				activeRatings,
				userName,
				wantMoreRatings,
			}));
		} else {
			const { userID } = data;

			userStateStore.update(state => ({
				...state,
				userID,
			}));

			openAnotherOverlay("onboardingPopup");
		}
	};

	const authTelegram = () => {
		if (typeof window !== "undefined") {
			window.Telegram.Login.auth(
				// eslint-disable-next-line camelcase
				{ bot_id: "1849789317", request_access: true },
				async tgResp => {
					if (!tgResp) {
						// todo: add custom error message
						handleError("Telegram auth failed");
						return;
					}

					console.log(tgResp);
					const isDataFromTg = await validateTelegram(tgResp);

					if (!isDataFromTg) {
						// todo: add custom error message
						handleError("Data is not from Telegram");
						return;
					}

					// eslint-disable-next-line camelcase
					const { first_name, auth_date, last_name, id } = tgResp;

					const { data, error } = await authThirdParty({
						id,
						type: "telegram",
						lang: $locale,
					});

					if (error) {
						handleError(error);
						return;
					}

					handleSuccess(data);
				},
			);
		}
	};

	const authMetamask = async () => {
		if (typeof window !== "undefined" && window.web3) {
			try {
				const id = await window.ethereum
					.request({
						method: "eth_requestAccounts",
					})
					.then(accounts => accounts[0])
					.catch(error => {
						if (error.code === 4001) {
							// EIP-1193 userRejectedRequest error
							// todo: add custom error message
							handleError("Please connect to MetaMask.");
						} else {
							handleError(error);
						}
					});

				console.log(id);

				const { data, error } = await authThirdParty({
					id,
					type: "web3",
					lang: $locale,
				});

				if (error) {
					handleError(error);
					return;
				}

				handleSuccess(data);
			} catch (error) {
				handleError(error);
			}
		} else {
			// todo: add custom error message
			handleError("wallet not found");
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
