<script>
    export let autocomplete = false;
    export let placeholder = '';
</script>

<input
    class="mt-4 p-2 w-full rounded-md shadow"
    type="text"
    { autocomplete }
    { placeholder }
    on:input
>

<style>
    input {
        border: 2px solid var(--active-color);
        transition: background-color .1s;
    }

    input:focus {
        outline: none;
        /* outline-offset: 4px; */
    }
</style>
