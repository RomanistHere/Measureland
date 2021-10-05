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
    class="fixed z-2 left-4 bottom-4 overflow-y-auto overflow-x-hidden rounded-md w-80 -lg:inset-0 -lg:w-full popup-shadow"
    in:fly="{{ x: -100, duration: 300 }}"
    out:fly="{{ x: -100, duration: 300 }}"
>
    <svelte:component this={Sidebar} { sidebarData }/>

    <CloseButton overlayType='sidebar' />
</aside>

<style>
    aside {
        top: calc(1rem + var(--navbar-height));
        background-color: var(--side-bg-color);
        /* try this */
        backdrop-filter: blur(7px) saturate(180%);
        -webkit-backdrop-filter: blur(7px) saturate(180%);
        background-color: rgba(255, 255, 255, 0.75);
        border-radius: 12px;
        border: 1px solid rgba(209, 213, 219, 0.3);
    }

    /* aside::-webkit-scrollbar {
        display: none;
    } */

    @media screen and (max-width: 1023px) {
        aside {
            top: var(--navbar-height);
        }
    }
</style>
