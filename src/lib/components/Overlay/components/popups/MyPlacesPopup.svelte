<script>
    import { _, locale } from 'svelte-i18n';

    import PopupWrap from './PopupWrap.svelte';
    import Spinner from '../../../Spinner.svelte';

    import { fetchRatedPlace } from "../../../../utilities/api.js";
    import { openAnotherOverlay } from "../../../../utilities/helpers.js";
    import { geocodeServiceReference } from "../../../../../stores/references.js";

    export let sidebarData;

    const geocodeService = $geocodeServiceReference;

    const openShowRatingsPopup = (lat, lng) =>
        openAnotherOverlay('showRatingsPopup', { lat, lng });

    const fetchData = async (geoID) => {
        const { error, data } = await fetchRatedPlace();

        // TODO:
        // if (error === `Couldn't find the user`) {
        //     showError('userNotFound')
        //     window.location.reload()
        //     return
        // } else if (error) {
        //     hideSpinner('.places__spinner')
        //     showError('unrecognizedError', error)
        //     return
        // }

        console.log(error)
        console.log(data)

        const { places } = data;

        const array = await await Promise.all(places.map(async ({ location }) => {
            const { coordinates } = location;
            const [ lng, lat ] = coordinates;

            const getAddress = () => new Promise((resolve, reject) => {
                geocodeService.reverse().latlng({ lat, lng }).language($locale).run((error, result) => {
                    if (error)
                        reject(error);

                    resolve(result.address.LongLabel);
                });
            });
            const address = await getAddress();

            return ({
                lang: $locale,
                lat,
                lng,
                address: address ? address : $_('myPlacesPopup.defaultAdress'),
            });
        }));

        return array;
    }

    let promise = fetchData(sidebarData);
</script>

<PopupWrap className='places__wrap'>
    {#await promise}
        <Spinner className="places__spinner" />
    {:then array}
        <div class="rating__popup rating__popup-active">
            <h2 class="rating__title title rating__item_text sidebar__title">{$_('myPlacesPopup.title')}</h2>
            <hr>
            <ul class="places__list">
                {#if array.length === 0}
                    <span>{$_('myPlacesPopup.youHaveNotRated')}</span>
                {:else}
                    {#each array as { lang, lat, lng, address }}
                        <a class="places__link underline" href="https://measureland.org/{lang}?lat={lat}&lng={lng}&showRating=true" on:click|preventDefault={() => openShowRatingsPopup(lat, lng)}>{address}</a>
                    {/each}
                {/if}
            </ul>
        </div>
    {/await}
</PopupWrap>
