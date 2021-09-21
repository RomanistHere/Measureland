<script>
    import MainButton from './MainButton.svelte';
    import SecondaryButton from './SecondaryButton.svelte';

    let isMini = false;
</script>

<nav class="fixed flex z-10 justify-center inset-x-0 top-0 {isMini ? 'h-16' : 'h-20'}">
    <ul class="m-0 px-4 w-full flex justify-between">
        <li class="m-0 p-0 list-none flex items-center justify-center">
            <a href="#" class="flex flex-wrap justify-center items-center decoration-none font-bold {isMini ? 'text-lg' : 'text-2xl'}">
                <img src="static/images/favicon.svg" alt="Measureland logo" width={isMini ? '40' : '50'}>
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
            <SecondaryButton text='Log in' />
            <MainButton text='Register' className='ml-4' />
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
