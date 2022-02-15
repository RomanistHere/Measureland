<script>
	import { _ } from 'svelte-i18n';
	
	import Tooltip from '../../../../ui-elements/Tooltip.svelte';
	import TextLink from '../../../../ui-elements/TextLink.svelte';
	import ShowRatingPopupStars from './ShowRatingPopupStars.svelte';
	
	export let title = '';
	export let link;
	export let linkText;
	export let tooltip;
	export let rating = null;
</script>

<li class="flex items-center justify-between my-3">
    <h2>
        { title }
	    {#if link && linkText}
		    <TextLink
			    text={linkText}
			    href={link}
			    blank={true}
		    />
	    {/if}
        <Tooltip { tooltip } />
    </h2>
	{#if !rating}
		{$_('loading.geo')}
	{:else if rating === 'unavailable'}
		{$_('loading.fail')}
	{:else}
		<ShowRatingPopupStars { rating } />
	{/if}
</li>

<style>
    h2 {
        font-size: 1.05rem;
    }
</style>
