<script>
	import { _, json, locale } from "svelte-i18n";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	import Profile from "./Profile.svelte";
	import Search from "./Search.svelte";

	import {
		closeOverlay,
		closeOverlays,
		getOpenedOverlay,
		logError,
		openAnotherOverlay,
		registerAction,
		setCookie,
		showSomethingWrongNotification,
		showSuccessNotification,
	} from "../../../../utilities/helpers.js";
	import { logout, saveLang } from "../../../../utilities/api.js";
	import { appStateStore, userStateStore } from "../../../../../stores/state.js";
	import FilterIcon from "$lib/components/inline-images/FilterIcon.svelte";

	export let mainScreen = true;

	let profileDropDownOpen = false;
	let profileButton = null;

	$: isUserLoggedIn = $userStateStore.userID !== null;

	const closeStartScreen = () => {
		const { termsOfUseAgreed, startScreen } = $appStateStore;
		if (!startScreen || !termsOfUseAgreed)
			return;

		appStateStore.update(state => ({ ...state, startScreen: false }));
		setCookie("startScreen", "0", 365);
		registerAction("navbarButtons");
	};

	const openRegister = () => {
		if (!$appStateStore.termsOfUseAgreed)
			return;
		closeStartScreen();
		openAnotherOverlay("registrationModal");
	};

	const openLogin = () => {
		if (!$appStateStore.termsOfUseAgreed)
			return;
		closeStartScreen();
		openAnotherOverlay("loginModal");
	};

	const changeLanguage = async nextLang => {
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

	// fix for development (items duplicated due to SvelteKit's or i18n's fault)
	const removeDuplicates = arrOfObjects => {
		const jsonObject = arrOfObjects.map(JSON.stringify);
		const uniqueSet = new Set(jsonObject);
		return Array.from(uniqueSet).map(JSON.parse);
	};

	$: navLinks = removeDuplicates($json("navBar.links"));

	const onNavLinkClick = () => {
		closeOverlays();
		appStateStore.update(state => ({ ...state, startScreen: false }));
	};

	let isFiltersActive = false;
	const openFilters = () => {
		const { overlay } = getOpenedOverlay();

		if (overlay === "filtersSidebar") {
			isFiltersActive = false;
			closeOverlay("sidebar");
		} else {
			isFiltersActive = true;
			openAnotherOverlay("filtersSidebar");
		}
	};
</script>

<nav class="absolute flex z-5 justify-between items-center inset-x-4 top-4 -lg:hidden">
	<div class="flex">
		<Search />

		<button
			class="rounded-lg bg-white px-3 ml-2 hover:bg-bg_hover transition-colors focus:bg-bg_active active:bg-bg_active focus:outline-none"
			on:click={openFilters}
		>
			<FilterIcon isActive={isFiltersActive} />
		</button>
	</div>

	<ul class="bg-white rounded-lg overflow-hidden shadow-lg">
		{#each navLinks as { text, url }}
			<li class="inline-block">
				<a
					class="block p-2 px-3 hoverable-link"
					class:text-main={$page.path === url}
					class:bg-new-active={$page.path === url}
					class:hover:bg-new-active={$page.path === url}
					class:cursor-default={$page.path === url}
					href={url}
					on:click={onNavLinkClick}
				>
					{text}
				</a>
			</li>
		{/each}
	</ul>

	<div class="flex">
		<div class="flex mr-4 bg-white rounded-lg overflow-hidden shadow-lg">
			<button
				class="block p-2 px-3 hoverable-link"
				class:text-main={$locale === "en"}
				class:bg-new-active={$locale === "en"}
				class:hover:bg-new-active={$locale === "en"}
				class:cursor-default={$locale === "en"}
				on:click={() => { changeLanguage("en") }}
			>
				ENG
			</button>
			<button
				class="block p-2 px-3 hoverable-link"
				class:text-main={$locale === "ru"}
				class:bg-new-active={$locale === "ru"}
				class:hover:bg-new-active={$locale === "ru"}
				class:cursor-default={$locale === "ru"}
				on:click={() => { changeLanguage("ru") }}
			>
				РУС
			</button>
		</div>

		<div>
			{#if isUserLoggedIn}
				<a
					href={"#"}
					class="flex items-center justify-center rounded-full bg-main-active text-white w-10 h-10 shadow-lg border border-main-active"
					title='{$_("navBar.account1")} {$userStateStore.userName}. {$_("navBar.account2")}'
					on:click={e => {
	                    e.preventDefault();
	                    profileDropDownOpen = !profileDropDownOpen;
	                }}
					bind:this={profileButton}
				>
					{$userStateStore.userName[0].toUpperCase()}
				</a>

				{#if profileDropDownOpen}
					<Profile
						closeDropDown={() => { profileDropDownOpen = false }}
						buttonRef={profileButton}
					/>
				{/if}
			{:else}
				<button
					class="text-center rounded-lg py-2 px-3 transition-colors bg-white -md:px-4 shadow-lg"
					on:click={openLogin}
					type="button"
				>
					{$_("navBar.secondaryBtn")}
				</button>
				<button
					class="text-center rounded-lg py-2 px-3 transition-colors bg-main text-white ml-2 -md:px-4 shadow-lg border border-main"
					on:click={openRegister}
					type="button"
				>
					{$_("navBar.primaryBtn")}
				</button>
			{/if}
		</div>
	</div>
</nav>
