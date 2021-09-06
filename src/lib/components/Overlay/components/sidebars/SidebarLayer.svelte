<script>
    import CommentsSidebar from './CommentsSidebar/CommentsSidebar.svelte';
    // import FiltersSidebar from './FiltersSidebar.svelte';
    import MenuSidebar from './MenuSidebar.svelte';

    export let sidebarName;
    export let sidebarData;

    const sidebarList = {
        commentsSidebar: CommentsSidebar,
        // filtersSidebar: FiltersSidebar,
        menuSidebar: MenuSidebar,
    };

    $: Sidebar = sidebarList[sidebarName];
</script>

<aside class="sidebar">
    <svelte:component this={Sidebar} { sidebarData }/>
</aside>

<style>
    aside {
        z-index: 4;
    }
</style>
