// NexusInsight Service Worker v1.2
const CACHE_NAME = 'nexus-insight-v1';
const STATIC_URLS = ['/', '/sectors', '/insights', '/calculator', '/offline'];

// ── Install: 핵심 페이지 선캐시 ───────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(STATIC_URLS).catch(() => {}) // 오프라인 첫 설치 시 실패 무시
    )
  );
  self.skipWaiting();
});

// ── Activate: 구버전 캐시 정리 ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: 전략적 캐싱 ──────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1) API 라우트 → Network First (최신 데이터 우선)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 2) Next.js 정적 자산 (_next/) → Cache First
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, resClone));
          return res;
        });
      })
    );
    return;
  }

  // 3) 페이지 → Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(res => {
        if (res.ok) { const resClone = res.clone(); caches.open(CACHE_NAME).then(c => c.put(event.request, resClone)); }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// ── Push: 알림 수신 및 표시 ──────────────────────────────────────────────────
self.addEventListener('push', event => {
  let data = { title: 'NexusInsight', body: '새로운 인사이트가 업데이트되었습니다.', url: '/' };
  try { data = { ...data, ...event.data.json() }; } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      image: '/icons/notification-banner.png',
      data: { url: data.url },
      vibrate: [100, 50, 100],
      requireInteraction: false,
      actions: [
        { action: 'open',  title: '📊 바로 보기' },
        { action: 'close', title: '닫기' },
      ],
      tag: 'nexus-insight-update',
      renotify: true,
    })
  );
});

// ── Notification Click: 앱 열기 ──────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'close') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // 이미 열린 창이 있으면 포커스
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // 없으면 새 창 열기
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

// ── Background Sync (향후 확장용) ────────────────────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'news-sync') {
    event.waitUntil(fetch('/api/news').catch(() => {}));
  }
});
