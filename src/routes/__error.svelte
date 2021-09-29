<script context="module">
    export function load({ error, status }) {
        return {
            props: {
                title: `${status}: ${error.message}`
            }
        };
    }
</script>

<script>
    export let title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<section class="w-full h-full flex justify-center items-center">
    <div class="text-center">
        <h1 class="text-3xl pb-4">{title}</h1>
        <a href="/" class="underline text-xl hover:no-underline">Main page</a>
    </div>
</section>
