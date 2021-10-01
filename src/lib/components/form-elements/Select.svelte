<script>
    import GroupTitle from './GroupTitle.svelte';

    export let options = [];
    export let title = '';
    export let id = '';
</script>

<div class="relative">
    <GroupTitle { title } />

    <select class="form__select mt-4 w-full rounded-md shadow" id="{id}" on:change>
        {#each options as { value, text, selected }, i}
            <option value={i} { selected }>{text}</option>
        {/each}
    </select>

    <span class="dot w-3 h-3 rounded-full absolute -left-6 top-14 opacity-0"></span>
    <span class="dot w-3 h-3 rounded-full absolute -right-6 top-14 opacity-0"></span>
</div>

<style>
    select {
        border: 2px solid var(--active-color);
        background-color: var(--side-bg-color);
    }

    select:focus {
        outline: none;
    }

    .dot {
        background-color: var(--active-color);
        transition: opacity .2s .1s;
    }

    select:focus + .dot {
        opacity: 1;
    }

    select:focus + .dot + .dot {
        opacity: 1;
    }
</style>
