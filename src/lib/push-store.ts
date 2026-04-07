/**
 * 인메모리 Push Subscription 저장소.
 * 로컬 개발용 - 프로덕션에서는 Upstash Redis / PlanetScale 등 외부 DB 사용 필요.
 * Vercel 서버리스 환경에서는 함수 인스턴스마다 메모리가 분리됨.
 */
import webpush from 'web-push';

// 모듈 싱글톤으로 런타임 동안 유지
const store = new Map<string, webpush.PushSubscription>();

export const pushStore = {
  add(sub: webpush.PushSubscription) {
    store.set(sub.endpoint, sub);
  },
  remove(endpoint: string) {
    store.delete(endpoint);
  },
  getAll(): webpush.PushSubscription[] {
    return Array.from(store.values());
  },
  count() {
    return store.size;
  },
};
