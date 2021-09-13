import { writable } from 'svelte/store';

export const mapReference = writable(null);
export const geocodeServiceReference = writable(null);
export const filterReferences = writable([
    { key: 'air', ref: null },
    { key: 'chill', ref: null },
    { key: 'clean', ref: null },
    { key: 'kids', ref: null },
    { key: 'logistic', ref: null },
    { key: 'noize', ref: null },
    { key: 'parking', ref: null },
    { key: 'pets', ref: null },
    { key: 'safety', ref: null },
    { key: 'transport', ref: null },
    { key: 'water', ref: null },
]);
