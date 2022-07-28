import { writable, derived } from "svelte/store";
import { overlayStateDefault } from "../lib/constants/overlayStateDefault.js";

export const flowStore = writable([]);

export const userStateStore = writable({
	userID: null,
	activeRatings: 3,
	dateCreated: null,
	userName: "Аноним",
	lang: "ru",
	uniqID: Math.random().toString(16).slice(2),
	shouldSendEvent: false,
	wantMoreRatings: false,
});

export const appStateStore = writable({
	zoom: 4,
	openModal: false,
	shouldWork: true,
	shouldShowPOIs: true,
	showRating: false,
	showPOI: false,
	ratingToSave: null,
	corrdsToSave: null,
	center: [ 55, 64 ],
	shouldShowLoading: false,
	startScreen: false,
	termsOfUseAgreed: true,
	shades: null,
	openedStory: null,
});

export const notificationsStore = writable({
	successNotification: false,
	somethingWrongNotification: false,
});

export const filtersStore = writable({
	isFiltersOn: false,
	filters: null,
});

export const markerStore = writable({
	markersToAdd: [],
	markersToRemove: [],
});

export const poisStore = writable({
	markersToAdd: [],
	markersToRemove: [],
});

export const overlayStateStore = writable(overlayStateDefault);

export const shouldShowFiltersNotification = derived(filtersStore, $filtersStore => $filtersStore.isFiltersOn);

export const appWidth = writable(0);

export const isDesktop = derived(appWidth, $appWidth => $appWidth >= 1024);

export const mapLoadingProgress = writable({
	pois: false,
	hexagons: false,
});
