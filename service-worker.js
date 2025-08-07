const CACHE_NAME = 'teacher-platform-cache-v1';
// أضف هنا الملفات الرئيسية التي تريد تخزينها
const urlsToCache = [
  './', // يمثل ملف index.html أو الصفحة الرئيسية
  './teacher.html', // اسم ملفك الرئيسي للمعلم
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 1. تثبيت الـ Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. تفعيل الـ Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // حذف أي كاش قديم
          }
        })
      );
    })
  );
});

// 3. اعتراض طلبات الشبكة (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد الطلب في الكاش، قم بإرجاعه
        if (response) {
          return response;
        }
        // إذا لم يوجد، اذهب إلى الشبكة للحصول عليه
        return fetch(event.request);
      }
    )
  );
});
