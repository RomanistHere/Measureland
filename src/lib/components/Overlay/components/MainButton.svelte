<script>
    export let action;
    export let text = '';
    export let className = 'rate__evaluate';
    export let disabled = false;
</script>

<a href={"#"} class="btn text-base lg:text-lg {className} {disabled && 'btn-disabled'}" on:click|preventDefault={action}>{text}</a>

<style>
    .d-b {
        display: block;
    }
</style>
