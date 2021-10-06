<script>
    import { fly } from 'svelte/transition';

    export let dropdownData = [];
    export let className = '';
</script>

<ul
    class="absolute rounded-md overflow-hidden popup-shadow glassmorphism {className}"
    in:fly="{{ y: 20, duration: 300 }}"
    out:fly="{{ y: -20, duration: 300 }}"
>
    {#each dropdownData as { text, action }}
        <li>
            <a class="block px-4 py-4" href={"#"} on:click|preventDefault={action}>{text}</a>
        </li>
    {/each}
</ul>

<style>
    a {
        transition: background-color .2s, color .2s;
    }

    a:hover {
        background-color: var(--active-color);
        color: var(--side-bg-color);
    }

    ul {
        transform: translateY(0);
    }
</style>
