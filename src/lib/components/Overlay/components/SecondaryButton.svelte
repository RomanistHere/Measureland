<script>
    export let action;
    export let text = '';
    export let className = '';
</script>

<a href={"#"} class="btn text-base lg:text-lg btn-low {className}" on:click|preventDefault={action}>{text}</a>
