import { build, timestamp } from '$service-worker';

const CACHE_NAME = `dev-measureland-2.0.0-${timestamp}`;
const CACHED_URLS = build;

// Open cache on install.
self.addEventListener('install', event => {
	event.waitUntil(async function () {
		const cache = await caches.open(CACHE_NAME);

		try {
			await cache.addAll(CACHED_URLS);
		} catch (e) {
			console.log(e);
		}
	}());
});

// Cache and update with stale-while-revalidate policy.
self.addEventListener('fetch', event => {
	const { request } = event;

	// don't cache/check anything but static folder
	if (!event.request.url.includes("/_app/")) {
		return;
	}

	// Prevent Chrome Developer Tools error:
	// Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode
	//
	// See also https://stackoverflow.com/a/49719964/1217468
	if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
		return;
	}

	event.respondWith(async function () {
		const cache = await caches.open(CACHE_NAME);

		const cachedResponsePromise = await cache.match(request);
		const networkResponsePromise = fetch(request);

		if (request.url.startsWith(self.location.origin)) {
			event.waitUntil(async function () {
				const networkResponse = await networkResponsePromise;
				await cache.put(request, networkResponse.clone());
			}());
		}

		return cachedResponsePromise || networkResponsePromise;
	}());
});

// Clean up caches other than current.
self.addEventListener('activate', event => {
	event.waitUntil(async function () {
		const cacheNames = await caches.keys();

		await Promise.all(
			cacheNames.filter(cacheName => {
				const deleteThisCache = cacheName !== CACHE_NAME;

				return deleteThisCache;
			}).map(cacheName => caches.delete(cacheName)),
		);
	}());
});
