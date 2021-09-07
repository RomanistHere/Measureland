<script>
    export let title;
    export let list;

    $: list = list.map(item => ({
        ...item,
        shouldShow: item.shouldShow === undefined || item.shouldShow === true ? true : false,
        target: item.targetBlank === false || item.href === '#' ? null : '_blank',
    }))
</script>

<div class="settings__block">
    <h2 class="rating__title title rating__item_text settings__title sidebar__title">{title}</h2>
    <hr>
    <nav>
        <ul class="settings__list">
            {#each list as { text, shouldShow, onClick, href, target }, i}
                {#if shouldShow}
                    <li class="setting__item">
                        <a { href } { target } class="settings__link rating__title" on:click={onClick}>{text}</a>
                    </li>
                {/if}
        	{/each}
        </ul>
    </nav>
</div>
