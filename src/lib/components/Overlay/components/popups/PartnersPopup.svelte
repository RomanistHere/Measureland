<script>
    import { json, _ } from 'svelte-i18n';

    import PopupTitle from './PopupTitle.svelte';
</script>

<div class="max-w-sm w-full">
    <PopupTitle title={$_('partnersPopup.ourFriendsAndPartners')} />

    <ul class="max-h-96 overflow-y-auto">
        {#each $json('partnersPopup.list') as item, i}
            {#if 0 !== i}
                <hr />
            {/if}

            <li class="my-4">
                {@html item}
            </li>
        {/each}
    </ul>
</div>
