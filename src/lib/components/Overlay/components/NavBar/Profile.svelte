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
		getDeclension,
	} from "$lib/utilities/helpers.js";
	import { logout, saveLang } from "$lib/utilities/api.js";
	import { userStateStore } from "../../../../../stores/state.js";
	import { goto } from "$app/navigation";

	export let closeDropDown;
	export let buttonRef;

	$: isLangInChange = false;
	$: isProtectionInChange = false;
	$: isUserLoggedIn = $userStateStore.userID !== null;

	let profileRef = null;

	const toggleLanguageChange = () => {
		if (isProtectionInChange)
			isProtectionInChange = false;
		isLangInChange = !isLangInChange;
	};

	const toggleProtectionChange = () => {
		if (isLangInChange)
			isLangInChange = false;
		isProtectionInChange = !isProtectionInChange;
	};

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

	const handleClickOutside = e => {
		const shouldNotClose =
			buttonRef === e.target
			|| buttonRef === e.target.parentNode
			|| buttonRef === e.target.parentNode.parentNode
			|| buttonRef === e.target.parentNode.parentNode.parentNode
			|| profileRef === e.target
			|| profileRef === e.target.parentNode
			|| profileRef === e.target.parentNode.parentNode
			|| profileRef === e.target.parentNode.parentNode.parentNode
			|| profileRef === e.target.parentNode.parentNode.parentNode.parentNode
			|| profileRef === e.target.parentNode.parentNode.parentNode.parentNode.parentNode
			|| profileRef === e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
			|| profileRef === e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

		if (shouldNotClose)
			return;

		closeDropDown();
	};
</script>

<div
	class="absolute right-0 top-16 bg-white rounded-2xl p-4 pt-8 pb-6 w-88 text-txt_main"
	bind:this={profileRef}
>
	<h2
		class="text-4xl font-medium tracking-tight truncate"
		title={$userStateStore.userName}
	>
		{$userStateStore.userName}
	</h2>

	<ul class="flex text-txt_secondary mt-1 mb-3">
		<li class="mr-3">
			<span class="text-txt_main">{$userStateStore.numberOfRatings}</span>
			{getDeclension($userStateStore.numberOfRatings, [ "оценка", "оценки", "оценок" ])}
		</li>
		<li class="mr-3">
			<span class="text-txt_main">{$userStateStore.numberOfPois}</span>
			прим. мест
		</li>
		<li class="mr-3">
			<span class="text-txt_main">{$userStateStore.numberOfStories}</span>
			историй
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

	<ul class="mt-4">
		<li>
			<button
				class="flex w-full justify-between items-center p-3 rounded-lg transition-colors hover:bg-bg_slate"
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
				<ul class="bg-bg_gray rounded-lg mb-4">
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
		<li>
			<button
				class="flex w-full justify-between items-center p-3 rounded-lg transition-colors hover:bg-bg_slate"
				on:click={changeDataCollectionSettings}
			>
				Посылать сведения об ошибках
				<Toggler
					checked={$userStateStore.shouldSendEvent}
					on:change={changeDataCollectionSettings}
				/>
			</button>
		</li>
		<li>
			<button
				class="flex w-full justify-between items-center p-3 rounded-lg transition-colors hover:bg-bg_slate"
				on:click={toggleProtectionChange}
			>
				Безопасность
				<span class="flex items-center">
					<Chevron
						class={isProtectionInChange ? "transform rotate-90" : ""}
					/>
				</span>
			</button>
			{#if isProtectionInChange}
				<ul class="bg-bg_gray rounded-lg mb-4">
					<li>
						<button
							class="flex w-full justify-between items-center p-3 rounded-lg transition-colors hover:bg-bg_slate"
							on:click={openChangePasswordPopup}
						>
							Изменить пароль
						</button>
					</li>
					<li>
						<button
							class="flex w-full justify-between items-center p-3 rounded-lg transition-colors hover:bg-bg_slate"
							on:click={openDisconnectEmailPopup}
						>
							Отвязать почту
						</button>
					</li>
				</ul>
			{/if}
		</li>
		<li>
			<button
				class="flex w-full justify-between items-center p-3 rounded-lg transition-colors hover:bg-bg_slate"
				on:click={logoutUser}
			>
				Выход
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M2.66602 9.33203H6.66602V13.332" stroke="#9A9AA7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13.334 6.66797H9.33398V2.66797" stroke="#9A9AA7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9.33398 6.66667L14.0007 2" stroke="#9A9AA7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M2 13.9987L6.66667 9.33203" stroke="#9A9AA7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</li>
	</ul>
</div>

<svelte:window on:click={handleClickOutside}/>