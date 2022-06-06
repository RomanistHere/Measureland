<script>
	import { json } from "svelte-i18n";

	export let errorType = "unrecognizedError";
</script>

<div class="rounded-lg bg-bg_danger py-3 px-8 text-txt_danger text-center leading-5">
	{$json("errors")[errorType]}
</div>
