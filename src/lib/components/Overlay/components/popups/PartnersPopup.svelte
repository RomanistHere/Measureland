<script>
    import PopupWrap from './PopupWrap.svelte';
    import { json, _ } from 'svelte-i18n';
</script>

<PopupWrap className='partners__wrap'>
    <div class="rating__popup rating__popup-active">
        <h2 class="rating__title title rating__item_text sidebar__title">{$_('partnersPopup.ourFriendsAndPartners')}</h2>
        <hr>
        <ul class="partners__list">
            {#each $json('partnersPopup.list') as item}
                <li class="partners__item">
                    {@html item}
                </li>
            {/each}
        </ul>
    </div>
</PopupWrap>
