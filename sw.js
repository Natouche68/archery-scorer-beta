const PREFIX = 'V3';
const BASE = `${location.protocol}//${location.host}`;
const ASSETS = [
	`${BASE}/index.html`,
	`${BASE}/app.js`,
	`${BASE}/components/Scorer.js`,
	`${BASE}/icons/192.png`,
	`${BASE}/icons/512.png`,
	`${BASE}/zipcelx.js`,
	`${BASE}/manifest.json`,
	'https://cdn.jsdelivr.net/npm/halfmoon@1.1.1/css/halfmoon.min.css',
	'https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css',
	'https://cdn.jsdelivr.net/npm/halfmoon@1.1.1/js/halfmoon.min.js',
	'https://unpkg.com/boxicons@2.0.9/fonts/boxicons.woff2',
	'https://unpkg.com/boxicons@2.0.9/fonts/boxicons.woff',
	'https://unpkg.com/boxicons@2.0.9/fonts/boxicons.ttf',
	'https://cdn.skypack.dev/file-saver',
	'https://cdn.skypack.dev/lodash.escape',
	'https://cdn.skypack.dev/jszip',
];
// See README.md for more info
const JS_FILES = [`${BASE}/app.js`, `${BASE}/components/Scorer.js`, `${BASE}/zipcelx.js`];

self.addEventListener('install', (event) => {
	console.log('Service Worker -- Install');

	self.skipWaiting();
	event.waitUntil(
		(async () => {
			const cache = await caches.open(PREFIX);
			cache.addAll(ASSETS);
			JS_FILES.forEach(async (file) => {
				cache.put(new Request(file), await fetch(file));
			});
		})()
	);
});

self.addEventListener('activate', (event) => {
	console.log('Service Worker -- Activating');
	self.clients.claim();
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(
				keys.map((key) => {
					if (!key.includes(PREFIX)) {
						return caches.delete(key);
					}
				})
			);
		})()
	);
	console.log(`${PREFIX} active`);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				console.debug('Service Worker -- Get data from cache: ' + event.request.url);
				console.log('-----');
				console.log(response);
				console.log('-----');
				return response;
			}
			return fetch(event.request).then((fetchResponse) => {
				caches.open(PREFIX).then(async (cache) => {
					console.debug(
						'Service Worker -- Fetch and caching new resource: ' + event.request.url
					);

					cache.put(event.request, fetchResponse.clone());

					return fetchResponse;
				});
			});
		})
	);
});
