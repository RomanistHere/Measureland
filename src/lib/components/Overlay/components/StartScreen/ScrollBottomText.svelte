<script>
    import { fade } from "svelte/transition";

    export let text = "";
</script>

<div class="absolute bottom-5 w-full flex justify-center animate-bounce z-1 -md:text-sm" transition:fade>
    <svg class="mx-5 w-6 h-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
    {text}
    <svg class="mx-5 w-6 h-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
</div>
