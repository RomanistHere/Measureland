<script>
    export let title = '';
    export let list = [{
    	title: 'New super puper',
    	text: 'It is super puper new somthing. I just writing this text to fill an example.',
    	link: '#',
    }, {
    	title: 'New super puper opas',
    	text: 'It is super puper new somthing. I just writing this text to fill an example.',
    }, {
    	title: 'Old puper',
    	text: 'It is not super puper new somthing, so you know. I just writing this text to fill an example.',
    	link: '#',
    }, {
    	title: 'New super puper opas',
    	text: 'It is super puper new somthing. I just writing this text to fill an example.',
    }, {
    	title: 'Old puper',
    	text: 'It is not super puper new somthing, so you know. I just writing this text to fill an example.',
    	link: '#',
    }];
</script>

<div class="glassmorphism px-4 py-2 mb-8">
    <h3 class="text-2xl pt-4">
        {title}
    </h3>

    <ul>
        {#each list as { title, text, link }}
            <li class="my-4 rounded-md">
                {#if link}
                    <a href={link} class="link block p-2" target="_blank" rel="noopener">
                        {#if title}
                            <h4 class="font-bold">{title}</h4>
                        {/if}
                        {#if text}
                            <p>{text}</p>
                        {/if}
                    </a>
                {:else}
                    <span class="block p-2">
                        {#if title}
                            <h4 class="font-bold">{title}</h4>
                        {/if}
                        {#if text}
                            <p>{text}</p>
                        {/if}
                    </span>
                {/if}
            </li>
        {/each}
    </ul>
</div>

<style>
    :global(#svelte),
    :global(body),
    :global(html) {
        overflow: unset;
    }

    li {
        border: 2px solid var(--active-color);
    }

    .link:hover {
        text-decoration: underline;
    }
</style>
