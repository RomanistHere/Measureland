<script>
    import PrimaryButton from "../../../ui-elements/PrimaryButton.svelte";

    export let title = "";
    export let text1 = "";
    export let text2 = "";
    export let button = "";
    export let slideNumber;
    export let action = () => {};
    export let disabled = false;
</script>

<section class="flex items-center justify-center px-10 w-full h-full slide-{slideNumber + 1}">
    <div class="max-w-xl">
        <h1 class="lg:text-5xl -lg:text-3xl mb-10 @lg:text-5xl -md:text-2xl">{title}</h1>
        <p class="lg:text-2xl -md:text-base">{text1}</p>
        {#if text2}
            <p class="lg:text-2xl mt-5 -md:text-base">{text2}</p>
        {/if}
        {#if button}
            <PrimaryButton
                text={button}
                action={action}
                { disabled }
                className='inline-block mt-5 px-10 -md:text-sm'
            />
        {/if}
    </div>
</section>
