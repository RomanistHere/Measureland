<script>
	import { _, json, locale } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import PrimaryButton from '../../../ui-elements/PrimaryButton.svelte';
	import SecondaryButton from '../../../ui-elements/SecondaryButton.svelte';
	import UserProfileIcon from '../../../inline-images/UserProfileIcon.svelte';
	import DropdownMenu from '../../../ui-elements/DropdownMenu.svelte';
	import Search from './Search.svelte';

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
	} from '../../../../utilities/helpers.js';
	import { logout, saveLang } from '../../../../utilities/api.js';
	import { appStateStore, userStateStore } from "../../../../../stores/state.js";
	import FilterIcon from "$lib/components/inline-images/FilterIcon.svelte";

	export let mainScreen = true;

	let profileDropDownOpen = false;

	$: isUserLoggedIn = $userStateStore.userID !== null;

	$: dropdownData = [{
		text: $_('menuSidebar.logout'),
		action: async e => {
			e.preventDefault();
			profileDropDownOpen = false;
			closeOverlays();
			const { error } = await logout();

			if (!error) {
				userStateStore.update(state => ({
					...state,
					userID: null,
					activeRatings: 3,
					userName: 'Аноним',
					wantMoreRatings: false,
				}));
				showSuccessNotification();
				registerAction('navbarLogout');
			} else {
				logError(error);
				showSomethingWrongNotification();
			}
		},
	}, (mainScreen && {
		text: $_('menuSidebar.myRatings'),
		action: e => {
			e.preventDefault();
			profileDropDownOpen = false;
			openAnotherOverlay('myPlacesPopup');
		},
	}), {
		text: $_('menuSidebar.changePassword'),
		action: e => {
			e.preventDefault();
			profileDropDownOpen = false;
			openAnotherOverlay('forgotPasswordPopup', { isChangePass: true });
		},
	}].filter(Boolean);

	const closeStartScreen = () => {
		const { termsOfUseAgreed, startScreen } = $appStateStore;
		if (!startScreen || !termsOfUseAgreed)
			return;

		appStateStore.update(state => ({ ...state, startScreen: false }));
		setCookie('startScreen', '0', 365);
		registerAction('navbarButtons');
	};

	const openRegister = () => {
		if (!$appStateStore.termsOfUseAgreed)
			return;
		closeStartScreen();
		openAnotherOverlay('registerPopup');
	};

	const openLogin = () => {
		if (!$appStateStore.termsOfUseAgreed)
			return;
		closeStartScreen();
		openAnotherOverlay('loginPopup');
	};

	let isLeftHovered = false;
	const handleMouseenterLeft = () => {
		isLeftHovered = true;
	};
	const handleMouseleaveLeft = () => {
		isLeftHovered = false;
	};

	let isRightHovered = false;
	const handleMouseenterRight = () => {
		isRightHovered = true;
	};
	const handleMouseleaveRight = () => {
		isRightHovered = false;
	};

	let isCenterHovered = false;
	const handleMouseenterCenter = () => {
		isCenterHovered = true;
	};
	const handleMouseleaveCenter = () => {
		isCenterHovered = false;
	};

	const changeLanguage = async nextLang => {
		if ($locale === nextLang)
			return;

		locale.set(nextLang);
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);

			const pathSplit = url.pathname.split('/');
			pathSplit[1] = nextLang;
			url.pathname = pathSplit.join('/');
			await goto(url, { replaceState: true });

			if (isUserLoggedIn)
				await saveLang(nextLang);

			showSuccessNotification();
			registerAction('navbarLanguage');
		}
	};

	// fix for development (items duplicated due to SvelteKit's or i18n's fault)
	const removeDuplicates = arrOfObjects => {
		const jsonObject = arrOfObjects.map(JSON.stringify);
		const uniqueSet = new Set(jsonObject);
		return Array.from(uniqueSet).map(JSON.parse);
	};

	$: navLinks = removeDuplicates($json('navBar.links'));

	const onNavLinkClick = () => {
		closeOverlays();
		appStateStore.update(state => ({ ...state, startScreen: false }));
	};

	let isFiltersActive = false;
	const openFilters = () => {
		const { overlay } = getOpenedOverlay();

		if (overlay === 'filtersSidebar') {
			isFiltersActive = false;
			closeOverlay('sidebar');
		} else {
			isFiltersActive = true;
			openAnotherOverlay('filtersSidebar');
		}
	};
</script>

<nav class="absolute flex z-5 justify-between items-center inset-x-4 top-4 -lg:hidden">
	<div class="flex">
		<Search />

		<button
			class="rounded-md bg-white px-3 ml-2 hover:bg-bg_hover transition-colors border border-stroke focus:bg-bg_active active:bg-bg_active"
			on:click={openFilters}
		>
			<FilterIcon isActive={isFiltersActive} />
		</button>
	</div>

	<ul class="bg-white rounded-md overflow-hidden shadow-lg border border-stroke">
		{#each navLinks as { text, url }}
			<li class="inline-block border-r border-stroke last:border-0">
				<a
					class="block p-2 px-3 hoverable-link"
					class:text-main={$page.path === url}
					class:bg-new-active={$page.path === url}
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
		<div class="flex mr-4 bg-white rounded-md overflow-hidden shadow-lg border border-stroke">
			<button
				class="block p-2 px-3 hoverable-link border-r border-stroke"
				class:text-main={$locale === 'en'}
				class:bg-new-active={$locale === 'en'}
				class:cursor-default={$locale === 'en'}
				on:click={() => { changeLanguage('en') }}
			>
				ENG
			</button>
			<button
				class="block p-2 px-3 hoverable-link"
				class:text-main={$locale === 'ru'}
				class:bg-new-active={$locale === 'ru'}
				class:cursor-default={$locale === 'ru'}
				on:click={() => { changeLanguage('ru') }}
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
					on:blur={() => { setTimeout(() => { profileDropDownOpen = false }, 200) }}
					on:click={e => {
	                    e.preventDefault();
	                    profileDropDownOpen = !profileDropDownOpen;
	                }}
				>
					{$userStateStore.userName[0].toUpperCase()}
				</a>

				{#if profileDropDownOpen}
					<DropdownMenu
						class='right-0 w-48 top-16'
						{ dropdownData }
					/>
				{/if}
			{:else}
				<button
					class="text-center rounded-md py-2 px-3 transition-colors bg-white -md:px-4 shadow-lg border border-stroke"
					on:click={openLogin}
					type="button"
				>
					{$_('navBar.secondaryBtn')}
				</button>
				<button
					class="text-center rounded-md py-2 px-3 transition-colors bg-main text-white ml-2 -md:px-4 shadow-lg border border-main"
					on:click={openRegister}
					type="button"
				>
					{$_('navBar.primaryBtn')}
				</button>
			{/if}
		</div>
	</div>
</nav>

<!--<nav class="transition-all fixed flex z-5 justify-center inset-x-4 top-4 h-14 -lg:hidden">-->
<!--	<ul class="m-0 px-4 w-full flex justify-between">-->
<!--		<li class="m-0 p-0 list-none flex items-center justify-center">-->
<!--			<a-->
<!--				href="/{$locale}/"-->
<!--				class="flex flex-wrap justify-center items-center decoration-none font-bold text-lg"-->
<!--				on:mouseenter={handleMouseenterLeft}-->
<!--				on:mouseleave={handleMouseleaveLeft}-->
<!--			>-->
<!--				<img-->
<!--					src="/images/favicon.svg" alt="{$_('navBar.logoAlt')}" class="transition-all" width='40' height="35"-->
<!--				>-->
<!--				<span class="ml-4">-->
<!--                    {$_('navBar.logoTitle')}-->
<!--                </span>-->
<!--			</a>-->
<!--		</li>-->
<!--		<li-->
<!--			class="m-0 p-0 list-none flex items-center justify-center"-->
<!--			on:mouseenter={handleMouseenterCenter}-->
<!--			on:mouseleave={handleMouseleaveCenter}-->
<!--		>-->
<!--			<ul>-->
<!--				{#each navLinks as { text, url }}-->
<!--					<li class="inline-block">-->
<!--						<a-->
<!--							class="block mx-4 p-2 hover:underline"-->
<!--							href={url}-->
<!--							on:click={onNavLinkClick}-->
<!--						>-->
<!--							{text}-->
<!--						</a>-->
<!--					</li>-->
<!--				{/each}-->
<!--			</ul>-->
<!--		</li>-->
<!--		<li-->
<!--			class="m-0 p-0 list-none flex items-center justify-center {!$appStateStore.termsOfUseAgreed && 'opacity-30'}"-->
<!--			on:mouseenter={handleMouseenterRight}-->
<!--			on:mouseleave={handleMouseleaveRight}-->
<!--		>-->
<!--			<a class="block mx-4 p-2" href={'#'} on:click|preventDefault={changeLanguage}>-->
<!--				<span class:underline={$locale === 'ru'}>RU</span>-->
<!--				/-->
<!--				<span class:underline={$locale === 'en'}>EN</span>-->
<!--			</a>-->
<!--			{#if isUserLoggedIn}-->
<!--				<a-->
<!--					href={"#"}-->
<!--					class="flex items-center relative"-->
<!--					on:blur={() => { setTimeout(() => { profileDropDownOpen = false }, 200) }}-->
<!--					on:click={e => {-->
<!--                        e.preventDefault();-->
<!--                        profileDropDownOpen = !profileDropDownOpen;-->
<!--                    }}-->
<!--				>-->
<!--					<UserProfileIcon />-->
<!--					<div class="ml-2 flex">-->
<!--                        <span-->
<!--	                        class="name truncate block mr-1"-->
<!--	                        title='{$_("navBar.account1")} {$userStateStore.userName}. {$_("navBar.account2")}'-->
<!--                        >-->
<!--                            {$userStateStore.userName}-->
<!--                        </span>-->
<!--						- {$userStateStore.activeRatings}🏡-->
<!--					</div>-->

<!--					{#if profileDropDownOpen}-->
<!--						<DropdownMenu-->
<!--							className='-right-4 w-48 top-10 mt-2'-->
<!--							{ dropdownData }-->
<!--						/>-->
<!--					{/if}-->
<!--				</a>-->
<!--			{:else}-->
<!--				<SecondaryButton-->
<!--					text={$_('navBar.secondaryBtn')}-->
<!--					className='py-2'-->
<!--					disabled={!$appStateStore.termsOfUseAgreed}-->
<!--					action={openLogin}-->
<!--				/>-->
<!--				<PrimaryButton-->
<!--					text={$_('navBar.primaryBtn')}-->
<!--					className='ml-4 py-2'-->
<!--					disabled={!$appStateStore.termsOfUseAgreed}-->
<!--					action={openRegister}-->
<!--				/>-->
<!--			{/if}-->
<!--		</li>-->
<!--	</ul>-->
<!--	<div class="absolute inset-0 overflow-hidden -z-1 glassmorphism">-->
<!--		<div-->
<!--			class="absolute inset-0 -inset-x-80 -z-1 nav_gradient transform"-->
<!--			class:opacity-50={isCenterHovered || isLeftHovered || isRightHovered}-->
<!--			class:opacity-30={!isCenterHovered}-->
<!--			class:left-0={isLeftHovered}-->
<!--			class:right-0={isRightHovered}-->
<!--			class:scale-x-150={isCenterHovered}-->
<!--		></div>-->
<!--	</div>-->
<!--</nav>-->

<!--<style>-->
<!--	.nav_gradient {-->
<!--		background: #fde9ff;-->
<!--		background: linear-gradient(270deg, #FCEA8D 11.38%, #FBD2FF 50.48%, #D8F8FF 80.4%);-->
<!--		transition: all ease .5s;-->
<!--	}-->

<!--	.name {-->
<!--		max-width: 10rem;-->
<!--	}-->
<!--</style>-->
