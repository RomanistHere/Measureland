<script>
    import { _, json } from 'svelte-i18n';

    import TextLink from '../../../TextLink.svelte';
    import PopupTitle from './PopupTitle.svelte';

    import { userStateStore } from "../../../../../stores/state.js";

    $: list = $json('loggedInPopup.list');
</script>

<div class="max-w-sm w-full">
    <PopupTitle title="{$_('loggedInPopup.welcome')}, {$userStateStore.userName}!" />

    <p class="my-3">
        {$_('loggedInPopup.activeRatingsRemaining')}: {$userStateStore.activeRatings}.
    </p>

    {#if $userStateStore.activeRatings <= 5}
        <p class="my-3">
            <TextLink
                href="blog/how-to-become-citizen/"
                blank={true}
                text={$_('loggedInPopup.learnWhyLimits')}
            />
            {$_('loggedInPopup.learnWhyLimitsAddition')}
        </p>
    {/if}

    <p class="my-3">
        {$_('loggedInPopup.hereSomeArticles')}:
    </p>

    <ul class="pl-5">
        {#each list as { text, link }}
            <li class="my-3">
                <TextLink
                    href={link}
                    blank={true}
                    text={text}
                />
            </li>
        {/each}
    </ul>
</div>

<style>
    ul {
        list-style-type: square;
    }
</style>
