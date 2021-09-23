<script>
    import MainButton from './MainButton.svelte';
    import SecondaryButton from './SecondaryButton.svelte';

    import { appStateStore } from "../../../../stores/state.js";
</script>

<nav
    class="transition-all fixed flex z-1 justify-center inset-x-0 top-0 h-14"
>
    <ul class="m-0 px-4 w-full flex justify-between">
        <li class="m-0 p-0 list-none flex items-center justify-center">
            <a href="#" class="flex flex-wrap justify-center items-center decoration-none font-bold text-lg">
                <div class="w-12 flex justify-center">
                    <img src="static/images/favicon.svg" alt="Measureland logo" class="transition-all" width='40'>
                </div>
                <span class="ml-4">
                    Measureland
                </span>
            </a>
        </li>
        <li class="m-0 p-0 list-none flex items-center justify-center">
            <a class="block mx-4 p-2" href="#">Blog</a>
            <a class="block mx-4 p-2" href="#">Community guides</a>
            <a class="block mx-4 p-2" href="#">Support</a>
        </li>
        <li class="m-0 p-0 list-none flex items-center justify-center">
            <SecondaryButton text='Log in' className='py-2' />
            <MainButton text='Register' className='ml-4 py-2' />
        </li>
    </ul>
</nav>

<style>
    nav {
        background-color: var(--bg-color);
    }

    a {
        color: var(--text-color);
    }
</style>
