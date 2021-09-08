import { writable } from 'svelte/store';
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
    filters: null,
    openModal: false,
    shouldWork: true,
    showRating: false,
    isFiltersOn: false,
    ratingToSave: null,
    corrdsToSave: null,
    center: [53.9, 27.5],
    shouldShowLoading: false,
});

export const overlayStateStore = writable(overlayStateDefault);
