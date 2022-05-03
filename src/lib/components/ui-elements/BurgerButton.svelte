<script>
    export let className = '';
    export let action = () => {};
</script>

<a
    href={"#"}
    class="absolute flex justify-center items-center z-1 popup-shadow glassmorphism w-16 h-16 right-4 {className}"
    on:click|preventDefault={action}
    role="button"
>
    <div class="relative">
        <span></span>
    </div>
</a>

<style>
    a {
        top: var(--distance-top);
        border-radius: 50%;

        -webkit-tap-highlight-color: transparent;

        --burger-size: 2.4rem;
        --layer-height: .6rem;
        --distance: calc((var(--burger-size) - (var(--layer-height) * 3)) / 2);
    }

    div {
        width: var(--burger-size);
        height: var(--burger-size);
    }

    div::before,
    div::after {
        content: '';
    }

    div::before,
    div::after,
    span {
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

    span {
        top: calc(var(--layer-height) + var(--distance));
    }

    div::after {
        top: calc((var(--layer-height) + var(--distance)) * 2);
    }

    @media (hover: hover) and (pointer: fine) {
        div:hover::before,
        div:hover::after {
            transform: translateX(-2px);
        }

        div:hover span {
            transform: translateX(2px);
        }
    }

    div:active::before,
    div:active::after {
        transform: translateX(2px);
    }

    div:active span {
        transform: translateX(-2px);
    }
</style>
