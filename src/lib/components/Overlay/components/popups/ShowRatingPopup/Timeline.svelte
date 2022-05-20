<script>
    import TimelinePoint from "./TimelinePoint.svelte";

    export let timelineData = [];
    $: data = timelineData.sort((a, b) => a.timeline - b.timeline);
</script>

<div class="my-4 flex justify-evenly flex-wrap">
    {#each data as item}
        <TimelinePoint { ...item } />
    {/each}
</div>
