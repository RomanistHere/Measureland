<script>
    import ChangeLanguage from '../ChangeLanguage.svelte';
    import Back from '../Back.svelte';

    export let slug;
    export let isAnotherLang = true;
    export let isGuide = false;
</script>

<Back backLevel={2} {isGuide} />

{#if isAnotherLang}
    <ChangeLanguage
        hrefEN='../../../en/blog/{slug}/'
        hrefRU='../../../ru/blog/{slug}/'
    />
{/if}
