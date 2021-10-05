<script>
    export let isLike = false;
    export let isDisabled = false;
    export let text = '';
    export let action;

    const emojIcon = isLike ? '👍': '👎';
</script>

<a
    href={"#"}
    class="inline-block p-1 mr-2 font-bold text-lg transition-transform"
    class:scale-125={isDisabled}
    on:click|preventDefault={action}
>
    <span>{emojIcon}</span>
    <span>{text}</span>
</a>

<style>
    .scale-125 {
        color: var(--active-color);
    }
</style>
