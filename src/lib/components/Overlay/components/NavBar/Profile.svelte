<script>
	import { browser } from "$app/env";
	import { locale } from "svelte-i18n";

	import SecondaryButton from "$lib/components/UI/SecondaryButton.svelte";
	import BigLink from "$lib/components/UI/BigLink.svelte";
	import Chevron from "$lib/components/UI/Chevron.svelte";
	import Toggler from "$lib/components/UI/Toggler.svelte";
	import Check from "$lib/components/UI/Check.svelte";

	import {
		closeOverlays,
		logError,
		openAnotherOverlay,
		registerAction,
		setCookie,
		showSomethingWrongNotification,
		showSuccessNotification,
	} from "$lib/utilities/helpers.js";
	import { logout, saveLang } from "$lib/utilities/api.js";
	import { userStateStore } from "../../../../../stores/state.js";
	import { goto } from "$app/navigation";

	export let closeDropDown;

	$: isLangInChange = false;
	$: isUserLoggedIn = $userStateStore.userID !== null;

	const toggleLanguageChange = () =>
		(isLangInChange = !isLangInChange);

	const logoutUser = async () => {
		closeDropDown();
		closeOverlays();
		const { error } = await logout();

		if (!error) {
			userStateStore.update(state => ({
				...state,
				userID: null,
				activeRatings: 3,
				userName: "Аноним",
				wantMoreRatings: false,
			}));
			showSuccessNotification();
			registerAction("navbarLogout");
		} else {
			logError(error);
			showSomethingWrongNotification();
		}
	};

	const changeDataCollectionSettings = () => {
		if (!browser)
			return;
		const shouldSendEvent = !$userStateStore.shouldSendEvent;
		setCookie("shouldSendEvent", shouldSendEvent ? "1" : "0", 365);
		userStateStore.update(state => ({ ...state, shouldSendEvent }));
	};

	const setNewLang = async nextLang => {
		isLangInChange = false;

		if ($locale === nextLang)
			return;

		locale.set(nextLang);
		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);

			const pathSplit = url.pathname.split("/");
			pathSplit[1] = nextLang;
			url.pathname = pathSplit.join("/");
			await goto(url, { replaceState: true });

			if (isUserLoggedIn)
				await saveLang(nextLang);

			showSuccessNotification();
			registerAction("navbarLanguage");
		}
	};

	// todo: rewrite functions below when ready

	const openDisconnectEmailPopup = () => {

	};

	const openForgotPassPopup = () => {
		closeOverlays();
		closeDropDown();
		openAnotherOverlay("forgotPasswordPopup", { isChangePass: true });
	};

	const openMyPlacesPopup = () => {
		closeOverlays();
		closeDropDown();
		openAnotherOverlay("myPlacesPopup");
	};

	const openChangePasswordPopup = () => {
		closeOverlays();
		closeDropDown();
		openForgotPassPopup();
	};
</script>

<div class="absolute right-0 top-16 bg-white rounded-2xl p-4 w-88">
	<h2
		class="text-4xl font-medium tracking-tight truncate"
		title="Константиныч который был прав, а потом не прав"
	>
		Константиныч который был прав, а потом не прав
	</h2>

	<ul class="flex text-txt_secondary my-2">
		<li class="mr-3">
			<b class="text-txt_main">3</b> оценки
		</li>
		<li class="mr-3">
			<b class="text-txt_main">5</b> прим. мест
		</li>
		<li class="mr-3">
			<b class="text-txt_main">7</b> историй
		</li>
	</ul>

	<SecondaryButton
		text="Посмотреть свои отметки"
		on:click={openMyPlacesPopup}
	/>
	<BigLink
		textBig="Заполнить анкету"
		textSmall="новое задание"
		class="my-2"
	/>

	<ul>
		<li>
			<button
				class="flex w-full justify-between items-center p-3"
				on:click={toggleLanguageChange}
			>
				Изменить язык
				<span class="flex items-center">
					{#if !isLangInChange}
						<span class="mr-2 text-txt_secondary">
							{$locale === "ru" ? "Русский" : "English"}
						</span>
					{/if}
					<Chevron
						class={isLangInChange ? "transform rotate-90" : ""}
					/>
				</span>
			</button>
			{#if isLangInChange}
				<ul class="bg-bg_gray rounded-lg">
					<li>
						<button
							class="flex justify-between items-center w-full p-3 rounded-lg transition-colors hover:bg-bg_slate"
							on:click={() => { setNewLang("ru") }}
						>
							Русский
							{#if $locale === "ru"}
								<Check />
							{/if}
						</button>
					</li>
					<li>
						<button
							class="flex justify-between items-center w-full p-3 rounded-lg transition-colors hover:bg-bg_slate"
							on:click={() => { setNewLang("en") }}
						>
							English
							{#if $locale === "en"}
								<Check />
							{/if}
						</button>
					</li>
				</ul>
			{/if}
		</li>
		<li class="flex w-full justify-between items-center p-3 text-left">
			Посылать сведения об ошибках
			<Toggler
				checked={$userStateStore.shouldSendEvent}
				on:change={changeDataCollectionSettings}
			/>
		</li>
		<li>
			<button
				class="flex w-full justify-between items-center p-3"
				on:click={openChangePasswordPopup}
			>
				Изменить пароль
			</button>
		</li>
		<li>
			<button
				class="flex w-full justify-between items-center p-3"
				on:click={openDisconnectEmailPopup}
			>
				Отвязать почту
			</button>
		</li>
		<li>
			<button
				class="flex w-full justify-between items-center p-3"
				on:click={logoutUser}
			>
				Выход
			</button>
		</li>
	</ul>
</div>