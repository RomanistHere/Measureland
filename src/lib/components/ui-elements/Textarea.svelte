<script>
    export let maxCommentLength;
    export let placeholder;
    export let className;
</script>

<div class="relative">
    <textarea
        class="w-full h-40 p-2 rounded-md {className}"
        { placeholder }
        maxlength={maxCommentLength}
        on:input
    ></textarea>

    <span class="dot w-3 h-3 rounded-full absolute -left-6 -md:-left-4 top-4 opacity-0"></span>
    <span class="dot w-3 h-3 rounded-full absolute -right-6 -md:-right-4 top-4 opacity-0"></span>
</div>

<style>
    textarea {
        border: 2px solid var(--active-color);
        transition: background-color .1s;
    }

    textarea:focus {
        outline: none;
    }

    .dot {
        background-color: var(--active-color);
        transition: opacity .2s .1s;
    }

    textarea:focus + .dot {
        opacity: 1;
    }

    textarea:focus + .dot + .dot {
        opacity: 1;
    }
</style>
