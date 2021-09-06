<script>
    export let action;
    export let text = '';
</script>

<a href={"#"} class="rate__evaluate btn" on:click|preventDefault={action}>{text}</a>
