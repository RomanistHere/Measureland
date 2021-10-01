<script>
    export let autocomplete;
    export let placeholder;
    export let className;
</script>

<input
    class="mt-4 p-2 w-full rounded-md shadow {className}"
    type="text"
    { autocomplete }
    { placeholder }
    on:change
>

<span class="dot w-3 h-3 rounded-full absolute -left-6 top-20 opacity-0"></span>
<span class="dot w-3 h-3 rounded-full absolute -right-6 top-20 opacity-0"></span>

<style>
    input {
        border: 2px solid var(--active-color);
        transition: background-color .1s;
    }

    input:focus {
        outline: none;
    }

    .dot {
        background-color: var(--active-color);
        transition: opacity .2s .1s;
    }

    input:focus + .dot {
        opacity: 1;
    }

    input:focus + .dot + .dot {
        opacity: 1;
    }
</style>
