<script>
    import { fade } from 'svelte/transition';
</script>

<div class="right-4 absolute" transition:fade>
    <svg class="w-full h-full" width="163" height="197" viewBox="0 0 163 197" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 153.577L82.1328 193.805L160.5 153.588V2.49998H2.5V153.577Z" fill="#26AD04" stroke="#001A23" stroke-width="5"/>
        <path d="M16.584 86.8191C14.4448 84.1748 17.6616 80.574 20.5293 82.4027L71.6698 115.014C72.9865 115.854 74.7271 115.543 75.6717 114.299L140.249 29.291C142.479 26.355 147.014 29.2508 145.289 32.5094L79.1259 157.484C78.119 159.386 75.4959 159.641 74.1422 157.967L16.584 86.8191Z" fill="white"/>
    </svg>
</div>

<style>
    div {
        top: calc(2rem + 64px + var(--navbar-height));
        width: 64px;
    }
</style>
