<script>
    import PrimaryButton from '../../../ui-elements/PrimaryButton.svelte';

    export let title = '';
    export let text1 = '';
    export let text2 = '';
    export let button = '';
    export let slideNumber;
    export let action = () => {};
    export let disabled = false;
</script>

<section class="flex items-center justify-center px-10 w-full h-full slide-{slideNumber + 1}">
    <div class="max-w-xl">
        <h1 class="lg:text-5xl -lg:text-3xl mb-10 @lg:text-5xl">{title}</h1>
        <p class="lg:text-2xl">{text1}</p>
        {#if text2}
            <p class="lg:text-2xl mt-5">{text2}</p>
        {/if}
        {#if button}
            <PrimaryButton text={button} action={action} { disabled } className='inline-block mt-5 px-10 {disabled && 'opacity-30'}' />
        {/if}
    </div>
</section>

<style>
    .slide-1 {
        background: radial-gradient(46.49% 30.77% at 33.76% 31.67%, #C9FFC8 0%, #D4EFF5 100%);
    }

    .slide-2 {
        background: radial-gradient(47.79% 32.75% at 62.27% 67.12%, #D0CFFF 0%, #D4EFF5 100%);
    }

    .slide-3 {
        background: radial-gradient(68.08% 39.64% at 31.92% 37.63%, #FFE0FA 0%, #D4EFF5 100%);
    }

    .slide-4 {
        background: radial-gradient(43.07% 32.28% at 66.97% 71.42%, #FFD8D8 0%, #D4EFF5 100%);
    }
</style>
