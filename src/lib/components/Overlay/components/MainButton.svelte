<script>
    export let action;
    export let text = '';
    export let className = 'rate__evaluate';
</script>

<a href={"#"} class="btn text-base lg:text-lg {className}" on:click|preventDefault={action}>{text}</a>

<style>
    .d-b {
        display: block;
    }
</style>
