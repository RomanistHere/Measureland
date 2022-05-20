<script>
    import TextLink from "./TextLink.svelte";

    export let text = "";
    export let textLink = "";
    export let hrefLink = "";
    export let checked = false;
    export let className = null;

    const isLink = textLink.length > 0;
</script>

<label class="{className} relative block select-none cursor-pointer flex items-center flex-row-reverse justify-end">
    <p>
        {text}
        {#if isLink}
            <TextLink blank={true} href={hrefLink} text={textLink} />
        {/if}
    </p>
    <input type="checkbox" id="terms" class="absolute opacity-0 h-0 w-0 cursor-pointer" bind:checked={checked}>
    <span class="box relative flex justify-center items-center left-0 top-0 h-6 w-6 shrink-0 mr-2 -md:h-5 -md:w-5"></span>
</label>

<style>
    .box {
        background-color: var(--text-color);
    }

    input:checked ~ .box::after {
        background: var(--active-color);
    }

    .box::after {
        position: absolute;
        content: "";
        width: 70%;
        height: 70%;
        background: var(--non-active-color);
    }
</style>
