<script>
    import { onMount } from 'svelte';

    import { overlayStateStore, appStateStore, appWidth } from '../../../stores/state.js';
    import { closeOverlays, openAnotherOverlay, closeOverlay } from '../../utilities/helpers.js';

    import PopupLayer from './components/popups/PopupLayer.svelte';
    import SidebarLayer from './components/sidebars/SidebarLayer.svelte';
    import FiltersNotification from './components/notifications/FiltersNotification.svelte';
    import CornerNotification from './components/notifications/CornerNotification.svelte';
    import BurgerButton from '../ui-elements/BurgerButton.svelte';
    import Loading from './components/Loading.svelte';
    import NavBar from './components/NavBar.svelte';

    export let mainScreen = true;
    export let hiddenLoading = false;

    let popupActive = false;
    let popupName;
    let popupData;
    let sidebarActive = false;
    let sidebarName;
    let sidebarData;
    let StartScreen;

    const handleKeydown = event => {
    	const key = event.key;
    	// console.log(key);
    	if ((popupActive || sidebarActive) && key === 'Escape')
    		closeOverlays();
    };

    const checkIsOpen = state => {
    	let openOverlays = [];
    	for (const [ key, value ] of Object.entries(state)) {
    		const { isOpen, data, type } = value;
    		if (isOpen)
    			openOverlays.push({ key, data, type });
    	}

    	if (openOverlays.length >= 2 && openOverlays[0].type === openOverlays[1].type) {
    		throw new Error(`Can't open two or more modals at once`);
    	}

    	if (openOverlays.length === 1 && openOverlays[0].key === 'commentsSidebar') {
    		// close sidebar if only comments is opened (expected behaviour: user closes rating)
    		openOverlays = [];
    		closeOverlays();
    	}

    	return openOverlays;
    };

    const manageOverlay = ({ key, data, type }) => {
    	if (type === 'sidebar') {
    		sidebarName = key;
    		sidebarData = data;
    		sidebarActive = true;
    	} else if (type === 'popup') {
    		popupName = key;
    		popupData = data;
    		popupActive = true;
    	}

    	if (popupActive || sidebarActive)
    		appStateStore.update(state => ({ ...state, openModal: true }));
    	else
    		appStateStore.update(state => ({ ...state, openModal: false }));
    };

    const manageOverlays = openOverlays => {
    	sidebarActive = false;
    	popupActive = false;

    	if (openOverlays.length === 0)
    		return;

    	for (let i = 0; i < openOverlays.length; i++)
    		manageOverlay(openOverlays[i]);
    };

    const toggleSideBar = () => sidebarActive
    	? closeOverlay('sidebar')
    	: openAnotherOverlay('menuSidebar');

    $: dataOpen = checkIsOpen($overlayStateStore);
    $: manageOverlays(dataOpen);

    onMount(async() => {
    	const module = await import('./components/StartScreen/StartScreen.svelte');
    	StartScreen = module.default;
    });
</script>

<!-- // show loader while user data is loading -->
{#if !hiddenLoading}
    <Loading />
{/if}

{#if popupActive}
    <PopupLayer { popupName } { popupData } />
{/if}

{#if mainScreen}
    {#if sidebarActive}
        <SidebarLayer { sidebarName } { sidebarData } />
    {/if}

    <BurgerButton
        action={toggleSideBar}
    />

    {#if $appStateStore.startScreen}
        <svelte:component this={StartScreen}/>
    {/if}
{/if}

<NavBar />

<FiltersNotification />
<CornerNotification />

<svelte:window
    on:keydown={handleKeydown}
    on:popstate={closeOverlays}
    bind:innerWidth={$appWidth}
/>
