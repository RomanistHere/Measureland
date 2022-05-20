<script>
    export let text = "";
    export let href = "#";
    export let className = "";
    export let blank = null;

    const target = blank ? "_blank" : null;
    const rel = blank ? "noopener" : null;
</script>

<a
    { href }
    { target }
    { rel }
    class="underline transition-colors hover:text-white hover:bg-active hover:no-underline {className}"
>
    {text}
</a>
