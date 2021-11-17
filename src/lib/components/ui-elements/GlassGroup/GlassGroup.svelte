<script>
    import { _ } from 'svelte-i18n';
    import { flip } from "svelte/animate";

    import VotingElement from './VotingElement.svelte';
    import PrimaryButton from '../PrimaryButton.svelte';

    import { openAnotherOverlay, debounce } from "../../../utilities/helpers.js";

    export let title = '';
    export let type = 'links';
    export let list = [];

    const sortList = () => {
    	list = list.sort((a, b) => {
    		const diffA = a.upvoted || 0 - a.downvoted || 0;
    		const diffB = b.upvoted || 0 - b.downvoted || 0;
    		return diffB - diffA;
    	});
    };

    const debouncedSorting = debounce(sortList, 200);

    const updateNumbers = event => {
    	const { id, upvoted, downvoted } = event.detail;

    	for (let i = 0; i < list.length; i++) {
    		const curID = list[i].id;
    		if (id === curID) {
    			list[i] = {
    				...list[i],
    				upvoted,
    				downvoted,
    			};
    			break;
    		}
    	}

    	debouncedSorting();
    };
</script>

<div class="glassmorphism px-4 py-2 mb-8">
    <h3 class="text-2xl pt-4 -md:text-lg">
        {title}
    </h3>

    <ul>
        {#each list as { title, text, link, id } (id || Math.random().toString(16).slice(2))}
            <li class="my-4 rounded-md glassmorphism" animate:flip>
                {#if type === 'vote'}
                    <VotingElement
                        {title}
                        {text}
                        {id}
                        on:updateNumbers={updateNumbers}
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

    {#if type === 'vote'}
        <PrimaryButton
            text={$_('commuinty.submitSuggestionBtn')}
            className="text-center block px-10 mb-2"
            action={() => { openAnotherOverlay('feedbackPopup') }}
        />
    {/if}
</div>

<style>
    li {
        border: 2px solid var(--active-color);
    }

    @media (hover: hover) and (pointer: fine) {
        .link {
            transition: background-color .2s, color .2s;
        }

        .link:hover {
            background-color: var(--active-color);
            color: white;
        }
    }
</style>
