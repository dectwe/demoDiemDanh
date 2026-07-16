const CACHE_NAME = 'ai-attendance-v4'; // Tăng lên v4 để ép điện thoại xóa cache cũ
const ASSETS = [
  '/',
  '/index.html',
  '/register.html',
  '/manifest.json',
  '/face-api-local.js', // Đổi tên file thư viện tại đây
  
  '/face-api.js-master/weights/ssd_mobilenetv1_model-weights_manifest.json',
  '/face-api.js-master/weights/ssd_mobilenetv1_model-shard1',
  '/face-api.js-master/weights/face_landmark_68_model-weights_manifest.json',
  '/face-api.js-master/weights/face_landmark_68_model-shard1',
  '/face-api.js-master/weights/face_recognition_model-weights_manifest.json',
  '/face-api.js-master/weights/face_recognition_model-shard1'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
