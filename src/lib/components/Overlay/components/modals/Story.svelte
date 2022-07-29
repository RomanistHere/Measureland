<script>
	import { onDestroy } from "svelte";
	import { _ } from "svelte-i18n";
	import { fade, fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";

	import sanitizeHtml from "sanitize-html";
	import "simple-scrollbar/simple-scrollbar.css";

	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import VoteButton from "$lib/components/UI/VoteButton.svelte";
	import Story from "$lib/components/Story/Story.svelte";

	import { fetchStory, reactStory } from "$lib/utilities/api.js";
	import {
		logError,
		closeOverlay,
		openAnotherOverlay,
		showSomethingWrongNotification,
	} from "$lib/utilities/helpers.js";
	import { mapReference } from "../../../../../stores/references.js";
	import { appStateStore, userStateStore } from "../../../../../stores/state.js";

	export let modalData;

	const map = $mapReference;
	const isUserLoggedIn = $userStateStore.userID !== null;

	let currentStorySlug = null;

	$: promise = null;
	$: storyConfig = {
		lngLat: modalData.lngLat || null,
		title: modalData.title || "",
		bodyHtml: "",
		author: "",
		likes: 0,
		dislikes: 0,
		isLiked: false,
		isDisliked: false,
	};

	const fetchData = async ({ storySlug, lngLat }) => {
		const { data, error } = await fetchStory(storySlug);

		if (error) {
			logError(error);
			closeOverlay("modal");
			return;
		}

		const { result } = data;

		if (!lngLat)
			map.flyTo({ center: result.lngLat });

		storyConfig = {
			...storyConfig,
			...result,
			bodyHtml: sanitizeHtml(result.content, {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat([ "img" ]),
			}),
		};

		if (typeof window !== "undefined") {
			const SimpleScrollbar = await import("simple-scrollbar");
			SimpleScrollbar.initAll();
		}

		appStateStore.update(state => ({ ...state, openedStory: storySlug }));
	};

	const submitLike = async () => {
		if (!isUserLoggedIn) {
			openAnotherOverlay("loginModal");
			return;
		}

		if (storyConfig.isLiked)
			return;

		if (storyConfig.isDisliked) {
			storyConfig = {
				...storyConfig,
				isDisliked: false,
				dislikes: storyConfig.dislikes - 1,
			};
		}

		storyConfig = {
			...storyConfig,
			isLiked: true,
			likes: storyConfig.likes + 1,
		};

		const { error } = await reactStory("like", currentStorySlug);

		if (error) {
			logError(error);
			showSomethingWrongNotification();
		}
	};

	const submitDislike = async () => {
		if (!isUserLoggedIn) {
			openAnotherOverlay("loginModal");
			return;
		}

		if (storyConfig.isDisliked)
			return;

		if (storyConfig.isLiked) {
			storyConfig = {
				...storyConfig,
				isLiked: false,
				likes: storyConfig.likes - 1,
			};
		}

		storyConfig = {
			...storyConfig,
			isDisliked: true,
			dislikes: storyConfig.dislikes + 1,
		};

		const { error } = await reactStory("dislike", currentStorySlug);

		if (error) {
			logError(error);
			showSomethingWrongNotification();
		}
	};

	// need to check in order not to do unnecessary requests.
	$: if (currentStorySlug !== modalData.storySlug) {
		if (modalData.lngLat)
			map.flyTo({ center: modalData.lngLat });

		promise = fetchData(modalData);
		currentStorySlug = modalData.storySlug;
	}

	onDestroy(() => {
		appStateStore.update(state => ({ ...state, openedStory: null }));
	});
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
					action={submitLike}
				/>
				<VoteButton
					isActive={storyConfig.isDisliked}
					text={storyConfig.dislikes || 0}
					action={submitDislike}
				/>
			</div>
		</div>
	</div>

	<CloseButton
		overlayType="modal"
		class="top-2 right-2 z-2"
		isWhite={true}
	/>
</div>
