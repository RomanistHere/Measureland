<script>
    export let title;
    export let list;
    export let className = '';

    $: list = list.map(item => ({
    	...item,
    	shouldShow: item.shouldShow === undefined || item.shouldShow === true ? true : false,
    	target: item.targetBlank === false || item.href === '#' ? null : '_blank',
    }));
</script>

<div class="mb-6 {className}">
    <h2 class="font-bold px-8 text-xl underline">{title}</h2>
    <ul class="mt-1">
        {#each list as { text, shouldShow, onClick, href, target }, i}
            {#if shouldShow}
                <li>
                    <a { href } { target } class="block px-8 text-lg py-2 leading-5" on:click={onClick}>{text}</a>
                </li>
            {/if}
    	{/each}
    </ul>
</div>

<style>
    a {
        transition: background-color .2s, color .2s;
    }

    @media (hover: hover) and (pointer: fine) {
        a:hover {
            background-color: var(--active-color);
            color: var(--side-bg-color);
        }
    }
</style>
