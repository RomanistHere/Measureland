import { writable } from 'svelte/store'

export const flowStore = writable([]);

// TODO:
export const userStateStore = writable({
    userID: null,
    passToken: null,
    activeRatings: 2,
    dateCreated: null,
    userName: 'Аноним',
    // lang: detectPrefLang(),
    lang: 'ru',
    wasMoreRatingsAsked: false,
    uniqID: Math.random().toString(16).slice(2),
    // shouldSendEvent: getCookie('sentryOn') !== '0' ? true : false,
    shouldSendEvent: false,
});

export const appStateStore = writable({
    zoom: 12,
    filters: null,
    openModal: false,
    isFiltersOn: false,
    ratingToSave: null,
    corrdsToSave: null,
    center: [53.9, 27.5],
    shouldShowLoading: false,
});

export const overlayStateStore = writable({
    loginPopup: false,
    registerPopup: false,
    forgotPasswordPopup: false,
    changePasswordPopup: false,
    showRatingsPopup: false,
    quizPopup: false,
});
