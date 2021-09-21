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
    class="sidebar"
    in:fly="{{ x: 200, duration: 80 }}"
>
    <svelte:component this={Sidebar} { sidebarData }/>
</aside>

<style>
    aside {
        z-index: 4;
    }
</style>
