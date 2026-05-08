const CACHE_NAME = 'mkd-viewer-v1';
const FILES_TO_CACHE = [
    './',
    './viewer.html',
    './data.json',
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js'
];

// Установка Service Worker — сохраняем файлы в кеш
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Кеширование файлов');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Активация — удаляем старые кеши
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('Удаление старого кеша', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

// Перехват запросов — отдаём из кеша
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Нашли в кеше — отдаём
            if (response) {
                return response;
            }
            // Нет в кеше — идём в сеть
            return fetch(event.request);
        })
    );
});
