<script>
    import { fly } from 'svelte/transition';

    export let dropdownData = [];
    export let className = '';
</script>

<ul
    class="absolute {className} rounded-md shadow-xl"
    in:fly="{{ y: 20, duration: 300 }}"
    out:fly="{{ y: -20, duration: 300 }}"
>
    {#each dropdownData as { text, action }}
        <li>
            <a class="block px-4 py-3" href={"#"} on:click|preventDefault={action}>{text}</a>
        </li>
    {/each}
</ul>

<style>
    a {
        transition: background-color .2s;
    }

    a:hover {
        background-color: var(--bg-color);
    }
</style>
