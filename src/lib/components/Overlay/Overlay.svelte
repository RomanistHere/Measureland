<script>
    import PopupLayer from './components/PopupLayer.svelte';
    // import SidebarLayer from './components/SidebarLayer.svelte';
    const popupActive = false;

</script>

{#if popupActive}
    <PopupLayer />
{/if}
<!-- <SidebarLayer /> -->
