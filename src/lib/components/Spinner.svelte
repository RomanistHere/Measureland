<script>
    import { _, json } from 'svelte-i18n';
    import { onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';

    $: statusText = $_('spinner.start');

    export let className = '';
    export let isWithText = false;
    let shouldShowText = false;
    let spinnerInterval;
    let spinnerTimeout;

    const resetTimers = () => {
        clearInterval(spinnerInterval);
        clearTimeout(spinnerTimeout);
        shouldShowText = false;
    }

    const updateText = () => {
        if (!isWithText) {
            resetTimers();
            return;
        }

        let i = 0;

        spinnerTimeout = setTimeout(() => {
            shouldShowText = true;
            spinnerInterval = setInterval(() => {
                statusText = $json('spinner.change')[i];
                i = i >= 2 ? 0 : i + 1;
            }, 3000);
        }, 2000);
    }


    $: updateText(isWithText);

    onDestroy(resetTimers);
</script>

<div class="flex justify-center items-center {className ? className : 'relative'}">
    <div class="spinner h-20 w-20"></div>
    {#if shouldShowText}
        {#key statusText}
            <p
                class="italic absolute inset-x-0 top-1/2 mt-14 text-center"
                in:fly={{ y: -20 }}
                out:fly={{ y: 20 }}
            >
                {statusText}
            </p>
    	{/key}
    {/if}
</div>

<style>
    .spinner {
        border: 1.25rem solid var(--bg-color);

        animation: spinner 2s linear infinite;
    }

    .non-transparent {
        background-color: var(--side-bg-color);
    }

    @keyframes spinner {
        0%, 100% {
            border-top-color: rgba(212, 239, 245, 1);
            border-right-color: rgba(212, 239, 245, .66);
            border-bottom-color: rgba(212, 239, 245, .33);
            border-left-color: rgba(212, 239, 245, 0);
        }
        25% {
            border-top-color: rgba(212, 239, 245, .66);
            border-right-color: rgba(212, 239, 245, .33);
            border-bottom-color: rgba(212, 239, 245, 0);
            border-left-color: rgba(212, 239, 245, 1);
        }
        50% {
            border-top-color: rgba(212, 239, 245, .33);
            border-right-color: rgba(212, 239, 245, 0);
            border-bottom-color: rgba(212, 239, 245, 1);
            border-left-color: rgba(212, 239, 245, .66);
        }
        75% {
            border-top-color: rgba(212, 239, 245, 0);
            border-right-color: rgba(212, 239, 245, 1);
            border-bottom-color: rgba(212, 239, 245, .66);
            border-left-color: rgba(212, 239, 245, .33);
        }
    }
</style>
