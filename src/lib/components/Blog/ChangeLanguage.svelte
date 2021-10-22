<script>
    import { locale } from 'svelte-i18n';

    import FlagRU from '../inline-images/FlagRU.svelte';
    import FlagGB from '../inline-images/FlagGB.svelte';

    export let hrefEN = '#';
    export let hrefRU = '#';

    const changeLanguage = lang => {
    	if ($locale === lang)
    		return;
    	locale.set(lang);
    };
</script>

<aside class="aside">
    <a
        href={hrefRU}
        on:click={() => { changeLanguage('ru') }}
        class="w-14 h-8 inline-block rounded-md overflow-hidden"
    >
        <FlagRU className="w-full h-full" />
    </a>
    <a
        href={hrefEN}
        on:click={() => { changeLanguage('en') }}
        class="w-14 h-8 inline-block rounded-md overflow-hidden"
    >
        <FlagGB className="w-full h-full" />
    </a>
</aside>
