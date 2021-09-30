<script>
    import { _ } from 'svelte-i18n';

    import MainButton from '../MainButton.svelte';
    import PopupTitle from './PopupTitle.svelte';

    import { closeOverlay } from "../../../../utilities/helpers.js";

    export let title = '';
    export let text = '';
    export let button = '';

    const closePopup = () => closeOverlay('popup');
</script>

<div class="max-w-sm w-full">
    <PopupTitle { title } />

    <p class="my-4">
        {text}
    </p>

    <MainButton text="{button}" className="text-center block" action={closePopup} />
</div>
