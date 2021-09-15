<script>
    export let action;
    export let text = '';
    export let className = 'rate__evaluate';
</script>

<a href={"#"} class="btn {className}" on:click|preventDefault={action}>{text}</a>
