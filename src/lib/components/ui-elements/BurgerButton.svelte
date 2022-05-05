<script>
    export let className = '';
</script>

<button
    class="absolute flex justify-center items-center z-1 popup-shadow glassmorphism w-16 h-16 right-4 {className}"
    on:click
>
    <span class="relative">
        <span class="elem"></span>
    </span>
</button>

<style>
    button {
        top: var(--distance-top);
        border-radius: 50%;

        -webkit-tap-highlight-color: transparent;

        --burger-size: 2.4rem;
        --layer-height: .6rem;
        --distance: calc((var(--burger-size) - (var(--layer-height) * 3)) / 2);
    }

    button > span {
        width: var(--burger-size);
        height: var(--burger-size);
    }

    button > span::before,
    button > span::after {
        content: '';
    }

    button > span::before,
    button > span::after,
    .elem {
        position: absolute;

        width: 100%;
        top: 0;
        left: 0;
        height: var(--layer-height);
        border: 1px solid var(--text-color);

        box-sizing: border-box;

        background-color: var(--bg-color);
        box-shadow: 0 0 1px var(--text-color);
        transition: transform .2s;
    }

    .elem {
        top: calc(var(--layer-height) + var(--distance));
    }

    button > span::after {
        top: calc((var(--layer-height) + var(--distance)) * 2);
    }

    @media (hover: hover) and (pointer: fine) {
        button > span:hover::before,
        button > span:hover::after {
            transform: translateX(-2px);
        }

        button > span:hover .elem {
            transform: translateX(2px);
        }
    }

    button > span:active::before,
    button > span:active::after {
        transform: translateX(2px);
    }

    button > span:active .elem {
        transform: translateX(-2px);
    }
</style>
