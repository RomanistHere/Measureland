<script>
    import { fly } from "svelte/transition";

    export let dropdownData = [];

    let customClass = "";
    export { customClass as class };
</script>

<ul
    class="absolute rounded-md overflow-hidden bg-white {customClass}"
    in:fly="{{ y: 20, duration: 300 }}"
    out:fly="{{ y: -20, duration: 300 }}"
>
    {#each dropdownData as { text, action }}
        <li>
            <button
                class="block w-full px-4 py-4 text-left hoverable-link"
                on:click={action}
            >
                {text}
            </button>
        </li>
    {/each}
</ul>
