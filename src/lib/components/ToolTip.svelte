<script>
    export let tooltip;
    export let side = 'top';
</script>

<div class="info">
    ?
    <span class="info__tooltip info__tooltip-{side}">
        {tooltip}
    </span>
</div>

<style>
    .info {
        position: relative;
        z-index: 2;
        display: inline-block;

        font-family: sans-serif;
        font-weight: bold;
        text-align: center;
        font-size: 0.8em;
        line-height: 0.8em;
        color: inherit;
        text-decoration: none;

        border-radius: 50%;
        padding: 0.13em 0.2em 0.09em 0.2em;
        border: 1px solid;
    }

    .info__tooltip {
        position: absolute;
        z-index: 1;
        pointer-events: none;

        visibility: hidden;
        opacity: 0;

        width: 240px;
        padding: 5px 10px;
        border-radius: 6px;

        background-color: var(--text-color);

        color: var(--side-bg-color);
        text-align: center;
        font-size: 16px;
        font-weight: normal;
        line-height: 1.5;

        transition: opacity .6s;
    }

    .info__tooltip-top {
        bottom: 150%;
        left: -124px;
    }

    .info__tooltip-top::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: var(--text-color) transparent transparent transparent;
    }

    .info__tooltip-right {
        top: 0;
        transform: translateY(-47%);
        left: 125%;
    }

    .info__tooltip-right::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 100%;
        margin-top: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent var(--text-color) transparent transparent;
    }

    .info__tooltip-left {
        top: 0;
        transform: translateY(-47%);
        bottom: auto;
        right: 160%;
    }

    .info__tooltip-left::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 100%;
        margin-top: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent transparent var(--text-color);
    }

    .info__tooltip-bottom {
        top: 135%;
        left: 50%;
        margin-left: -60px;
    }

    .info__tooltip-bottom::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent #555 transparent;
    }

    .info:hover .info__tooltip {
        visibility: visible;
        opacity: 1;
    }
</style>
