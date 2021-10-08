<script>
    import GroupTitle from './GroupTitle.svelte';

    export let options = [];
    export let title = '';
    export let id = '';
    export let className = '';
</script>

<div class="{className}">
    <GroupTitle { title } />

    <div class="relative">
        <select class="form__select mt-4 p-2 w-full rounded-md shadow" id="{id}" on:change>
            {#each options as { value, text, selected }, i}
                <option value={value ? value : i} { selected }>{text}</option>
            {/each}
        </select>

        <span class="dot w-3 h-3 rounded-full absolute -left-6 -md:-left-4 top-8 opacity-0"></span>
        <span class="dot w-3 h-3 rounded-full absolute -right-6 -md:-right-4 top-8 opacity-0"></span>
    </div>
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
