<script>
    export let text = "";
    export let className = "";
    export let href = "#";
    export let action;
    export let isDisabled = false;
    export let title = null;
</script>

<a
    { href }
    { title }
    class="underline transition-colors duration-200 hover:bg-active hover:text-white hover:no-underline {className}"
    class:opacity-40={isDisabled}
    class:pointer-events-none={isDisabled}
    on:click|preventDefault={action}
>
    {text}
</a>
