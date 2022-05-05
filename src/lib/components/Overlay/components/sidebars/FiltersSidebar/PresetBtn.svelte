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
    class="rounded-md px-2 py-0.5 text-sm mb-1 block duration-500 transition-colors hover:bg-active hover:text-white"
    class:text-white={isActive}
    class:bg-active={isActive}
    class:bg-neutral-feeling={!isActive}
    class:cursor-default={isActive}
    on:click|preventDefault={onPresetBtnClick}
>
    {presetText}
</a>
