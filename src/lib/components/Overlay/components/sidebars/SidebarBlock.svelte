<script>
    export let title;
    export let list;
    export let className = '';

    $: list = list.map(item => ({
    	...item,
    	shouldShow: item.shouldShow === undefined || item.shouldShow === true ? true : false,
    	target: item.href.includes('https://') ? '_blank' : null,
    }));
</script>

<div class="my-2 {className}">
    <div class="px-6">
        <hr>
    </div>
    <ul class="mt-1">
        {#each list as { text, shouldShow, onClick, href, target }, i}
            {#if shouldShow}
                <li>
                    <a
                        { href }
                        { target }
                        class="block px-6 py-2 leading-5 hoverable-link"
                        on:click={onClick}
                    >
                        {text}
                    </a>
                </li>
            {/if}
    	{/each}
    </ul>
</div>
