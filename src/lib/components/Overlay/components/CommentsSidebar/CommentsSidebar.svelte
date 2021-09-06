<script>
    import { browser } from '$app/env';
    import { getContext, onDestroy } from 'svelte';

    import SidebarWrap from '../SidebarWrap.svelte';
    import CommentBlock from './CommentBlock.svelte';
    import Spinner from '../../../Spinner.svelte';

    import { fetchComments } from "../../../../utilities/api.js";
    import { appStateStore, userStateStore } from "../../../../../stores/state.js";
    import { getFinalRating, roundToTen, openAnotherOverlay } from '../../../../utilities/helpers.js';

    export let sidebarData;

    console.log(sidebarData)

    const fetchData = async (geoID) => {
        const { error, data } = await fetchComments(geoID);

        console.log(error)
        console.log(data)

        return data;
    }
    // TODO: spinner
    let promise = fetchData(sidebarData);
</script>

<SidebarWrap>
    {#await promise}
        <Spinner />
    {:then response}
        <h2 class="rating__title title rating__item_text comments__title sidebar__title">Comments</h2>
        <hr>
        <ul class="comments__wrap">
            {#each response.array.sort((a, b) => b.liked - a.liked) as data}
                <CommentBlock { data } />
            {/each}
        </ul>
    {/await}
</SidebarWrap>
