<script>
    import PopupWrap from './PopupWrap.svelte';
    import { _, json } from 'svelte-i18n';

    import { userStateStore } from "../../../../../stores/state.js";

    $: list = $json('loggedInPopup.list');
</script>

<PopupWrap className='login__wrap'>
    <div class="rating__popup login__popup rating__popup-active loginPopup">
        <div class="rating__content login__content">
            <p class="my-3">
                <strong class="rating__text-highlight">{$_('loggedInPopup.welcome')}, {$userStateStore.userName}!</strong>
            </p>

            <p class="my-3">
                {$_('loggedInPopup.activeRatingsRemaining')}: {$userStateStore.activeRatings}.
            </p>

            {#if $userStateStore.activeRatings <= 5}
                <p class="my-3">
                    <a href="blog/how-to-become-citizen/" target="_blank" class="text_link underline">{$_('loggedInPopup.learnWhyLimits')}</a>. {$_('loggedInPopup.learnWhyLimitsAddition')}
                </p>
            {/if}

            <p class="my-3">
                {$_('loggedInPopup.hereSomeArticles')}:
            </p>

            <ul class="pl-5">
                {#each list as { text, link }}
                    <li class="my-3">
                        <a href={link} target="_blank" class="text_link underline">{text}</a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</PopupWrap>

<style>
    ul {
        list-style-type: square;
    }
</style>
