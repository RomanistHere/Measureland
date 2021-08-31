<script>
    import PopupLayer from './components/PopupLayer.svelte';
    // import SidebarLayer from './components/SidebarLayer.svelte';
    const popupActive = true;

</script>

{#if popupActive}
    <PopupLayer />
{/if}
<!-- <SidebarLayer /> -->
