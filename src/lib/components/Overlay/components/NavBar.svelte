<script>
    import MainButton from './MainButton.svelte';
    import SecondaryButton from './SecondaryButton.svelte';

    import { appStateStore } from "../../../../stores/state.js";

    let isLeftHovered = false;
    const handleMouseenterLeft = () => {
        isLeftHovered = true;
    }
    const handleMouseleaveLeft = () => {
        isLeftHovered = false;
    }

    let isRightHovered = false;
    const handleMouseenterRight = () => {
        isRightHovered = true;
    }
    const handleMouseleaveRight = () => {
        isRightHovered = false;
    }

    let isCenterHovered = false;
    const handleMouseenterCenter = () => {
        isCenterHovered = true;
    }
    const handleMouseleaveCenter = () => {
        isCenterHovered = false;
    }
</script>

<nav class="transition-all fixed flex z-1 justify-center inset-x-0 top-0 h-14">
    <ul class="m-0 px-4 w-full flex justify-between">
        <li class="m-0 p-0 list-none flex items-center justify-center">
            <a
                href="/"
                class="flex flex-wrap justify-center items-center decoration-none font-bold text-lg"
                on:mouseenter={handleMouseenterLeft}
                on:mouseleave={handleMouseleaveLeft}
            >
                <img src="static/images/favicon.svg" alt="Measureland logo" class="transition-all" width='40'>
                <span class="ml-4">
                    Measureland
                </span>
            </a>
        </li>
        <li
            class="m-0 p-0 list-none flex items-center justify-center"
            on:mouseenter={handleMouseenterCenter}
            on:mouseleave={handleMouseleaveCenter}
        >
            <a class="block mx-4 p-2" href="#">Blog</a>
            <a class="block mx-4 p-2" href="#">Community guides</a>
            <a class="block mx-4 p-2" href="#">Support</a>
        </li>
        <li
            class="m-0 p-0 list-none flex items-center justify-center"
            on:mouseenter={handleMouseenterRight}
            on:mouseleave={handleMouseleaveRight}
        >
            <SecondaryButton text='Log in' className='py-2' />
            <MainButton text='Register' className='ml-4 py-2' />
        </li>
    </ul>
    <div class="absolute inset-0 -inset-x-80 nav_gradient {!isCenterHovered && 'opacity-90'} {isLeftHovered && 'left-0 opacity-100'} {isRightHovered && 'right-0 opacity-100'} {isCenterHovered && 'transform scale-x-150 opacity-100'}"></div>
</nav>

<style>
    .nav_gradient {
        background: linear-gradient(270deg, #FCEA8D 11.38%, #FBD2FF 50.48%, #D8F8FF 80.4%);
        /* background: #fde9ff; */
        z-index: -1;
        transition: all ease .5s;
        box-shadow: 0px 0px 30px #fde9ff;
    }

    a {
        color: var(--text-color);
    }
</style>
