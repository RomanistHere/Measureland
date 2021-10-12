<script>
    export let timelineData = [];
    $: data = timelineData.sort((a, b) => a.timeline - b.timeline);
    $: min = data[0];
    $: max = data[data.length - 1];
    $: console.log(data)
</script>
