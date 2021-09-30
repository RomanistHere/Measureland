<script>
    export let action;
    export let text = '';
    export let className;
    export let disabled = false;
</script>

<a href={"#"} class="btn text-base lg:text-lg rounded-md py-2 {className} {disabled && 'btn-disabled'}" on:click|preventDefault={action}>{text}</a>
