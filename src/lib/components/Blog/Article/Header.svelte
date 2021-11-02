<script>
    import ChangeLanguage from '../ChangeLanguage.svelte';
    import Back from '../Back.svelte';

    export let slug;
    export let isAnotherLang = true;
    export let isGuide = false;

    const parentSlug = isGuide ? 'guides' : 'blog';
</script>

<Back {isGuide} />

{#if isAnotherLang}
    <ChangeLanguage
        hrefEN='../../../en/{parentSlug}/{slug}/'
        hrefRU='../../../ru/{parentSlug}/{slug}/'
    />
{/if}
