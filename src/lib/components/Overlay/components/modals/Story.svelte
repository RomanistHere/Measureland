<script>
	import { _ } from "svelte-i18n";
	import { fade, fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";

	import sanitizeHtml from "sanitize-html";
	import "simple-scrollbar/simple-scrollbar.css";

	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import Story from "$lib/components/Story/Story.svelte";

	import { fetchStory } from "$lib/utilities/api.js";

	export let modalData;

	let currentStoryId = null;
	let title = modalData.title;
	let bodyHtml = "";
	let author = "";

	$: promise = null;

	const fetchData = async ({ storyId }) => {
		const conststoryId = "62e058fbb706ab3645d6ca1a";
		const { data, error } = await fetchStory(conststoryId);

		console.log(data);

		const { result } = data;
		title = result.title;
		bodyHtml = sanitizeHtml(result.content, {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat([ "img" ]),
		});
		author = result.author;

		if (typeof window !== "undefined") {
			const SimpleScrollbar = await import("simple-scrollbar");
			SimpleScrollbar.initAll();
		}
	};

	// need to check in order not to do unnecessary requests.
	$: if (currentStoryId !== modalData.storyId) {
		promise = fetchData(modalData);
		currentStoryId = modalData.storyId;
	}
</script>

<div
	class="fixed top-20 bottom-0 left-4 bg-neutral-800 rounded-lg z-2 w-128 p-6 min-h-[30rem] text-white"
	ss-container
	use:focusTrap
	in:fly="{{ y: 50, duration: 200 }}"
	out:fly="{{ y: 50, duration: 200 }}"
>
	<Story
		{title}
		{bodyHtml}
		{author}
	/>

	<CloseButton
		overlayType="modal"
		class="top-4 right-2"
	/>
</div>
