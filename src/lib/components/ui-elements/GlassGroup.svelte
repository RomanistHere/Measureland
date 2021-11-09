<script>
    export let title = '';
    export let list = [
    	'text1',
    	'text2',
    	'text3',
    ];
</script>

<div class="glassmorphism px-4 py-2 mb-8">
    <h3 class="text-2xl">
        {title}
    </h3>

    <ul>
        {#each list as item}
            <li>{item}</li>
        {/each}
    </ul>
</div>

<style>
    div {
        width: 30%;
    }
</style>
