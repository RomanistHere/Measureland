<script>
    import { fly } from 'svelte/transition';

    import CommentsSidebar from './CommentsSidebar/CommentsSidebar.svelte';
    import FiltersSidebar from './FiltersSidebar/FiltersSidebar.svelte';
    import MenuSidebar from './MenuSidebar.svelte';

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
</aside>

<style>
    aside {
        top: calc(1rem + var(--navbar-height));
    }

    @media screen and (max-width: 1023px) {
        aside {
            top: var(--navbar-height);
        }
    }
</style>
