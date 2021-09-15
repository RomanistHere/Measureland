import { writable, derived } from 'svelte/store';
import { overlayStateDefault } from '../lib/constants/overlayStateDefault.js';

export const flowStore = writable([]);

// TODO:
export const userStateStore = writable({
    userID: null,
    passToken: null,
    activeRatings: 3,
    dateCreated: null,
    userName: 'Аноним',
    // lang: detectPrefLang(),
    lang: 'ru',
    uniqID: Math.random().toString(16).slice(2),
    // shouldSendEvent: getCookie('sentryOn') !== '0' ? true : false,
    shouldSendEvent: false,
    wantMoreRatings: false,
});

export const appStateStore = writable({
    zoom: 12,
    openModal: false,
    shouldWork: true,
    showRating: false,
    ratingToSave: null,
    corrdsToSave: null,
    center: [53.9, 27.5],
    shouldShowLoading: false,
});

export const notificationsStore = writable({
    successNotification: false,
});

export const filtersStore = writable({
    isFiltersOn: false,
    filters: null,
});

export const markerStore = writable({
    markersToAdd: [],
    markersToRemove: [],
});

export const overlayStateStore = writable(overlayStateDefault);

export const shouldShowFiltersNotification = derived(filtersStore, $filtersStore => $filtersStore.isFiltersOn);
