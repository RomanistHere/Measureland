<script>
    // import CommentsSidebar from './CommentsSidebar.svelte';
    // import FiltersSidebar from './FiltersSidebar.svelte';
    import MenuSidebar from './MenuSidebar.svelte';

    export let overlayName;
    export let overlayData;

    const sidebarList = {
        // commentsSidebar: CommentsSidebar,
        // filtersSidebar: FiltersSidebar,
        menuSidebar: MenuSidebar,
    };

    $: Sidebar = sidebarList[overlayName];
</script>

<aside class="sidebar">
    <svelte:component this={Sidebar} { overlayData }/>
</aside>

<style>
    aside {
        z-index: 4;
    }
</style>
