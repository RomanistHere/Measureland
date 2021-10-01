<script>
    import { createEventDispatcher } from 'svelte';

    import Tooltip from '../../../../../components/Tooltip.svelte';

    export let title;
    export let tooltip;
    export let caption;
    export let rating;
    export let key;

    const dispatch = createEventDispatcher();

    const handleClick = newRating => {
        rating = newRating;
        dispatch('setRating', { rating, key });
    }

    const character = String.fromCharCode('0xE900');
    const possibleRatingsArr = [5, 4, 3, 2, 1];
</script>

<div class="mt-6 relative">
    <h2 class="sug-color font-bold">
        {title}
        <Tooltip { tooltip } />
    </h2>
    <div class="wrap flex-row-reverse inline-flex my-2">
        {#each possibleRatingsArr as number}
            <a
                class="leading-none text-4xl ml-1 cursor-pointer s{number}"
                class:active={rating === number}
                on:click|preventDefault={(e) => {
                    handleClick(number);
                    e.currentTarget.blur();
                }}
            >
                {character}
            </a>
        {/each}
    </div>
    <span class="caption absolute right-0 bottom-1 text-sm opacity-0 italic">{caption}</span>
</div>

<style>
    a {
        font-family: 'star__icon';
        color: var(--non-active-color);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        transition: all .3s;
    }

    .active,
    .active ~ a {
        color: var(--active-color);
    }

    .caption {
        transition: opacity .2s;
    }

    @media (hover: hover) and (pointer: fine) {
        .wrap:hover + .caption {
            opacity: 1;
            transition: opacity .4s .5s;
        }

        a:hover,
        a:focus {
            transform: scale(1.3);
        }

        .s5:hover ~ a,
        .s5:focus ~ a,
        .s5:focus,
        .s5:hover {
            color: #00CC66;
        }

        .s4:hover ~ a,
        .s4:focus ~ a,
        .s4:focus,
        .s4:hover {
            color: #62AC04;
        }

        .s3:hover ~ a,
        .s3:focus ~ a,
        .s3:focus,
        .s3:hover {
            color: #A9AC04;
        }

        .s2:hover ~ a,
        .s2:focus ~ a,
        .s2:focus,
        .s2:hover {
            color: #DEC806;
        }

        .s1:hover ~ a,
        .s1:focus ~ a,
        .s1:focus,
        .s1:hover {
            color: #D05A04;
        }
    }
</style>
