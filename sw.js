self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                './index.html',
                './style.css',
                './uomTrack.js',
                './initSetup.js',
                './assets/images/arrow-down.png',
                './assets/images/arrow-up.png',
                './assets/images/background.jpg',
                './assets/images/delete.png',
                './assets/images/duplicate.png',
                './assets/images/icon.png',
                './assets/images/icon32.png',
                './assets/images/icon256.png',
                './assets/font/Score-Black.ttf',
                './assets/font/Score-Bold.ttf',
                './assets/font/Score-Regular.ttf',
                './assets/font/Score-Wide.ttf',
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith( caches.match(event.request) );
});