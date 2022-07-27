<script>
	import { _ } from "svelte-i18n";
	import { fade, fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";

	import sanitizeHtml from "sanitize-html";
	import "simple-scrollbar/simple-scrollbar.css";

	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import VoteButton from "$lib/components/UI/VoteButton.svelte";
	import Story from "$lib/components/Story/Story.svelte";

	import { fetchStory } from "$lib/utilities/api.js";

	export let modalData;

	let currentStoryId = null;
	let storyConfig = {
		title: "",
		bodyHtml: "",
		author: "",
	};

	$: promise = null;

	const fetchData = async ({ storyId }) => {
		const conststoryId = "62e058fbb706ab3645d6ca1a";
		const { data, error } = await fetchStory(conststoryId);

		console.log(data);

		const { result } = data;
		storyConfig = {
			...result,
			bodyHtml: sanitizeHtml(result.content, {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat([ "img" ]),
			}),
		};

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
	use:focusTrap
	in:fly="{{ y: 50, duration: 200 }}"
	out:fly="{{ y: 50, duration: 200 }}"
>
	<div class="absolute inset-4 right-6" ss-container>
		<Story
			title={storyConfig.title}
			bodyHtml={storyConfig.bodyHtml}
			author={storyConfig.author}
		/>

		<div class="overflow-hidden flex justify-end">
			<div class="-mx-1 pr-1">
				<VoteButton
					isLike={true}
					isActive={storyConfig.isLiked}
					text={storyConfig.likes || 0}
				/>
				<VoteButton
					isActive={storyConfig.isDisliked}
					text={storyConfig.dislikes || 0}
				/>
			</div>
		</div>
	</div>

	<CloseButton
		overlayType="modal"
		class="top-2 right-2"
	/>
</div>
