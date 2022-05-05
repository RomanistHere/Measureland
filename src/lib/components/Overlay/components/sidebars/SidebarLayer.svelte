<script>
    import { fly } from 'svelte/transition';

    import CommentsSidebar from './CommentsSidebar/CommentsSidebar.svelte';
    import FiltersSidebar from './FiltersSidebar/FiltersSidebar.svelte';
    import MenuSidebar from './MenuSidebar.svelte';
    import CloseButton from '../../../ui-elements/CloseButton.svelte';

    export let sidebarName;
    export let sidebarData;

    const sidebarList = {
    	commentsSidebar: CommentsSidebar,
    	filtersSidebar: FiltersSidebar,
    	menuSidebar: MenuSidebar,
    };

    $: Sidebar = sidebarList[sidebarName];
</script>

<aside
    class="fixed z-2 left-4 bottom-4 overflow-y-auto overflow-x-hidden rounded-md w-80 -lg:right-4 -lg:w-auto popup-shadow glassmorphism"
    in:fly="{{ x: -100, duration: 300 }}"
    out:fly="{{ x: -100, duration: 300 }}"
>
    <svelte:component this={Sidebar} { sidebarData }/>

    <CloseButton overlayType='sidebar' />
</aside>

<style>
    aside {
        top: var(--distance-top);
    }
</style>
