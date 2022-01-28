<script>
    import { _ } from 'svelte-i18n';

    import CommentBlock from './CommentBlock.svelte';
    import Spinner from '../../../../ui-elements/Spinner.svelte';

    import { fetchComments, fetchCommentsPOI } from "../../../../../utilities/api.js";
    import { showSomethingWrongNotification, logError } from '../../../../../utilities/helpers.js';

    export let sidebarData;

    const loadCommentsObj = {
	    'POI': fetchCommentsPOI,
	    'rating': fetchComments,
    };

    const fetchData = async ({ id, type }) => {
	    const loadComments = loadCommentsObj[type];
	    const { error, data } = await loadComments(id);

    	if (error) {
    		logError(error);
    		showSomethingWrongNotification();
    		return [];
    	}

    	return data;
    };

    $: promise = fetchData(sidebarData);
</script>

<div class="min-h-full px-0 pt-8 pb-20 -lg:pb-4">
    <h2 class="font-bold px-8 text-xl">{$_('commentSidebar.title')}</h2>
    {#await promise}
        <Spinner className="absolute-centered" />
    {:then response}
        <ul class="mt-2">
            {#each response.array.sort((a, b) => b.liked - a.liked) as data}
                <CommentBlock
	                { data }
	                type={sidebarData.type}
                />
            {/each}
        </ul>
    {/await}
</div>
