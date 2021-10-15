<script>
    import PrimaryButton from '../../../ui-elements/PrimaryButton.svelte';
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

    <div class="flex justify-evenly items-center mt-4">
        <PrimaryButton text="{button}" className="text-center block px-10" action={closePopup} />
    </div>
</div>
