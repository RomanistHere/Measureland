<script>
    import VotingElement from './VotingElement.svelte';

    export let title = '';
    export let type = 'links';
    export let list = [];
</script>

<div class="glassmorphism px-4 py-2 mb-8">
    <h3 class="text-2xl pt-4">
        {title}
    </h3>

    <ul>
        {#each list as { title, text, link, id }}
            <li class="my-4 rounded-md">
                {#if type === 'vote'}
                    <VotingElement
                        {title}
                        {text}
                        {id}
                    />
                {:else if link}
                    <a href={link} class="link block p-2" target="_blank" rel="noopener">
                        {#if title}
                            <h4 class="font-bold">{title}</h4>
                        {/if}
                        {#if text}
                            <p>{text}</p>
                        {/if}
                    </a>
                {:else}
                    <div class="block p-2">
                        {#if title}
                            <h4 class="font-bold">{title}</h4>
                        {/if}
                        {#if text}
                            <p>{text}</p>
                        {/if}
                    </div>
                {/if}
            </li>
        {/each}
    </ul>
</div>

<style>
    li {
        border: 2px solid var(--active-color);
    }

    .link {
        transition: background-color .2s, color .2s;
    }

    .link:hover {
        background-color: var(--active-color);
        color: white;
    }
</style>
