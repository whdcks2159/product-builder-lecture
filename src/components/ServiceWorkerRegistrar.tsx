'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(reg => {
        console.log('[SW] 등록 완료:', reg.scope);

        // 업데이트 감지
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] 새 버전 사용 가능 — 페이지 새로고침 시 적용됩니다.');
            }
          });
        });
      })
      .catch(err => console.warn('[SW] 등록 실패:', err));
  }, []);

  return null;
}
