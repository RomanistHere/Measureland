<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let presetNumber = 0;
    export let presetText = '';
    export let isActive = false;

    const onPresetBtnClick = () =>
        dispatch('presetClick', { presetNumber });
</script>

<a
    href={"#"}
    class="rounded-md px-2 py-0.5 text-sm mb-1 block {isActive && 'active'}"
    on:click|preventDefault={onPresetBtnClick}
>
    {presetText}
</a>

<style>
    a {
        background-color: #fcd9f6;
        /* background-color: #fce9a5; */
        /* background-color: #ddfaff; */
        transition: background-color .3s;
    }

    .active,
    a:hover {
        background-color: #fce9a5;
    }

    .active {
        cursor: default;
    }
</style>
