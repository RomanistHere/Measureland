<script>
    import { fly } from "svelte/transition";

    export let dropdownData = [];

    let customClass = "";
    export { customClass as class };
</script>

<ul
    class="absolute rounded-md overflow-hidden py-2 bg-white {customClass}"
    in:fly="{{ y: 20, duration: 300 }}"
    out:fly="{{ y: -20, duration: 300 }}"
>
    {#each dropdownData as { text, action, className }}
        <li>
            <button
                class="block w-full px-4 py-3 leading-5 text-left hoverable-link {className || ''}"
                on:click={action}
            >
                {text}
            </button>
        </li>
    {/each}
</ul>
