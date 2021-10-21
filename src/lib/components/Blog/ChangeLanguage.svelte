<script>
    import FlagRU from '../inline-images/FlagRU.svelte';
    import FlagGB from '../inline-images/FlagGB.svelte';

    export let hrefEN = '#';
    export let hrefRU = '#';
</script>

<aside class="aside">
    <a
        href={hrefRU}
        class="w-14 h-8 inline-block rounded-md overflow-hidden"
    >
        <FlagRU className="w-full h-full" />
    </a>
    <a
        href={hrefEN}
        class="w-14 h-8 inline-block rounded-md overflow-hidden"
    >
        <FlagGB className="w-full h-full" />
    </a>
</aside>
