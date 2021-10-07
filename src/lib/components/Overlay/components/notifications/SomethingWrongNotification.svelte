<script>
    import { fade, fly } from 'svelte/transition';
    import { json } from 'svelte-i18n';

    import SomethingWrongIcon from '../../../inline-images/SomethingWrongIcon.svelte';

    export let expanded = false;
</script>

<div
    transition:fade
    on:mouseenter
    on:mouseleave
    on:click
    class="relative"
>
    {#if expanded}
        <div
            class="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 text-right text-sm glassmorphism p-2"
            in:fly="{{ y: 10, duration: 150 }}"
            out:fly="{{ y: 10, duration: 150 }}"
        >
            {#each $json('errors.somethingWentWrong') as text}
                <p class="whitespace-nowrap">
                    {text}
                </p>
            {/each}
        </div>
    {/if}
    <SomethingWrongIcon />
</div>
