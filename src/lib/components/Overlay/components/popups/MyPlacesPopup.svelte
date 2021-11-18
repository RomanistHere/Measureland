<script>
    import { _, locale } from 'svelte-i18n';

    import PopupTitle from './PopupTitle.svelte';
    import Spinner from '../../../ui-elements/Spinner.svelte';
    import TextButton from '../../../ui-elements/TextButton.svelte';

    import { fetchRatedPlaces } from "../../../../utilities/api.js";
    import { openAnotherOverlay, showSomethingWrongNotification, logError } from "../../../../utilities/helpers.js";
    import { geocodeServiceReference } from "../../../../../stores/references.js";
    import { WEB_DOMAIN } from '../../../../../configs/env.js';

    const geocodeService = $geocodeServiceReference;

    const openShowRatingsPopup = (lat, lng) =>
    	openAnotherOverlay('showRatingsPopup', { lat, lng });

    const editRatingYear = (timeline, ratingID, address) =>
    	openAnotherOverlay('changeYearPopup', { timeline, ratingID, address });

    const fetchData = async() => {
    	const { error, data } = await fetchRatedPlaces();

    	if (error) {
    		logError(error);
    		showSomethingWrongNotification();
    		return [];
    	}

    	const { places } = data;

    	const array = await await Promise.all(places.map(async({ location, ratingObj }) => {
    		const { ratingID, timeline } = ratingObj;
    		const { coordinates } = location;
    		const [ lng, lat ] = coordinates;

    		const getAddress = () => new Promise((resolve, reject) => {
    			geocodeService.reverse().latlng({ lat, lng }).language($locale).run((err, result) => {
    				if (err)
    					reject(err);

    				resolve(result.address.LongLabel);
    			});
    		});
    		const address = await getAddress();

    		return ({
    			lang: $locale,
    			lat,
    			lng,
    			address: address ? address : $_('myPlacesPopup.defaultAdress'),
    			ratingID,
    			timeline,
    		});
    	}));

    	return array;
    };

    const promise = fetchData();
</script>

<div class="max-w-sm w-full">
    {#await promise}
        <Spinner isWithText={true} className="absolute w-full h-full inset-0 z-5" />
    {:then array}
        <PopupTitle title={$_('myPlacesPopup.title')} />

        <ul class="max-h-96 overflow-y-auto mt-2 py-2">
            {#if array.length === 0}
                <span>{$_('myPlacesPopup.youHaveNotRated')}</span>
            {:else}
                {#each array as { lang, lat, lng, address, ratingID, timeline }}
                    <li>
                        <TextButton
                            href="#"
                            action={() => editRatingYear(timeline, ratingID, address)}
                            text={timeline}
                            className="py-1 font-bold"
                        />:
                        <TextButton
                            href="{WEB_DOMAIN}/{lang}/?zoom=13&srlat={lat}&srlng={lng}"
                            action={() => openShowRatingsPopup(lat, lng)}
                            text={address}
                            className="py-1"
                        />
                    </li>
                {/each}
            {/if}
        </ul>
    {/await}
</div>
