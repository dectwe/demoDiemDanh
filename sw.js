const CACHE_NAME = 'ai-attendance-v5'; // Tăng phiên bản để ép trình duyệt xóa cache cũ
const ASSETS = [
  './',
  './index.html',
  './register.html',
  './manifest.json',
  './face-api-local.js', // File thư viện browser chuẩn
  
  // Đường dẫn weights chuẩn dạng tương đối để chạy tốt trên cả GitHub Pages
  './face-api.js-master/weights/ssd_mobilenetv1_model-weights_manifest.json',
  './face-api.js-master/weights/ssd_mobilenetv1_model-shard1',
  './face-api.js-master/weights/face_landmark_68_model-weights_manifest.json',
  './face-api.js-master/weights/face_landmark_68_model-shard1',
  './face-api.js-master/weights/face_recognition_model-weights_manifest.json',
  './face-api.js-master/weights/face_recognition_model-shard1'
];

// Cài đặt Service Worker và lưu assets vào bộ nhớ đệm
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Đang nạp tài nguyên offline...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Kích hoạt ngay lập tức không chờ đợi
  );
});

// Xóa cache cũ khi có phiên bản mới
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: Đang xóa bộ nhớ đệm cũ:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Chiến lược phản hồi: Ưu tiên lấy từ Bộ nhớ đệm Cache trước, nếu không có mới tải từ Internet
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Trả về file offline ngay lập tức (AI sẽ nạp siêu nhanh)
      }
      return fetch(e.request); // Tải từ internet nếu chưa có trong cache
    })
  );
});
