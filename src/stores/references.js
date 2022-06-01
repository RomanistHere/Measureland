import { writable } from "svelte/store";

export const mapReference = writable(null);
export const markersReference = writable(null);
export const ratingsReference = writable(null);
export const poiReference = writable(null);
export const geocodeServiceReference = writable(null);
export const leafletReference = writable({});
