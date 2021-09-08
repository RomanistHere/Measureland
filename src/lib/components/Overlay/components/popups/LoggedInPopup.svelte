<script>
    import PopupWrap from './PopupWrap.svelte';
    import { _, json } from 'svelte-i18n';

    import { userStateStore } from "../../../../../stores/state.js";

    $: list = $json('loggedInPopup.list');
</script>

<PopupWrap className='login__wrap'>
    <div class="rating__popup login__popup rating__popup-active loginPopup">
        <div class="rating__content login__content">
            <p class="rating__text">
                <strong class="rating__text-highlight">{$_('loggedInPopup.welcome')}, {$userStateStore.userName}!</strong>
            </p>

            <p class="rating__text">
                {$_('loggedInPopup.activeRatingsRemaining')}: {$userStateStore.activeRatings}.
            </p>

            <p class="rating__text">
                <a href="blog/how-to-become-citizen/" target="_blank" class="text_link">{$_('loggedInPopup.learnWhyLimits')}</a>. {$_('loggedInPopup.learnWhyLimitsAddition')}
            </p>

            <p class="rating__text">
                {$_('loggedInPopup.hereSomeArticles')}:
            </p>

            {#each list as { text, link }}
                <p class="rating__text">
                    <a href={link} target="_blank" class="text_link">{text}</a>
                </p>
            {/each}
        </div>
    </div>
</PopupWrap>
