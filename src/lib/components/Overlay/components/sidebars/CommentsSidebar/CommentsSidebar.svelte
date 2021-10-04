<script>
    import { _ } from 'svelte-i18n';

    import SidebarWrap from '../SidebarWrap.svelte';
    import CommentBlock from './CommentBlock.svelte';
    import Spinner from '../../../../Spinner.svelte';

    import { fetchComments } from "../../../../../utilities/api.js";

    export let sidebarData;

    const fetchData = async (geoID) => {
        const { error, data } = await fetchComments(geoID);

        // todo show error
        console.log(error)
        console.log(data)

        return data;
    }

    let promise = fetchData(sidebarData);
</script>

<SidebarWrap>
    <h2 class="font-bold px-8 text-xl">{$_('commentSidebar.title')}</h2>
    {#await promise}
        <Spinner className="absolute-centered" />
    {:then response}
        <ul class="mt-2">
            {#each response.array.sort((a, b) => b.liked - a.liked) as data}
                <CommentBlock { data } />
            {/each}
        </ul>
    {/await}
</SidebarWrap>
