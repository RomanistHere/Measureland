<script>
    import MainButton from '../MainButton.svelte';

    export let title = '';
    export let text = '';
    export let text2 = '';
    export let btnText = '';
    export let btnAction = () => {};
</script>

<section class="flex items-center justify-center w-full h-full">
    <div class="max-w-xl">
        <h1 class="text-5xl mb-10">{title}</h1>
        <p class="text-2xl">{text}</p>
        {#if text2}
            <p class="text-2xl mt-5">{text2}</p>
        {/if}
        {#if btnText}
            <MainButton text={btnText} action={btnAction} className='inline-block mt-5 px-10' />
        {/if}
    </div>
</section>
