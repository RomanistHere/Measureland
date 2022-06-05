<script>
	import { json } from "svelte-i18n";

	export let errorType = "unrecognizedError";
</script>

<div class="rounded-lg bg-bg_danger p-2 text-txt_danger text-center">
	{$json("errors")[errorType]}
</div>
