<script>
    export let isLike = false;
    export let isActive = false;
    export let text = "";
    export let action;

    const emojIcon = isLike ? "👍" : "👎";
</script>

<button
    class="p-2 px-4 rounded-md mx-1 bg-like_bg transition-colors border-like_bg border"

    class:hover:bg-like_bg_hover={isLike}
    class:hover:bg-dislike_bg_hover={!isLike}
    class:hover:border-like_bg_hover={isLike && !isActive}
    class:hover:border-dislike_bg_hover={!isLike && !isActive}
    class:hover:cursor-default={isActive}

    class:active:bg-like_bg_hover={isLike}
    class:active:bg-dislike_bg_hover={!isLike}
    class:active:border-on-green={isLike}
    class:active:border-txt_danger={!isLike}
    class:active:text-on-green={isLike}
    class:active:text-txt_danger={!isLike}

    class:bg-like_bg_hover={isActive && isLike}
    class:bg-dislike_bg_hover={isActive && !isLike}
    class:border-on-green={isActive && isLike}
    class:border-txt_danger={isActive && !isLike}
    class:text-on-green={isActive && isLike}
    class:text-txt_danger={isActive && !isLike}

    on:click|preventDefault={action}
>
    <span>{text}</span>
    <span>{emojIcon}</span>
</button>
