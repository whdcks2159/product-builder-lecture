import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { pushStore } from '@/lib/push-store';

function initVapid() {
  const pub  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  webpush.setVapidDetails('mailto:admin@nexus-insight.com', pub, priv);
  return true;
}

export async function POST(req: NextRequest) {
  if (!initVapid()) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  const body = await req.json();
  const subscription: webpush.PushSubscription = body.subscription;

  if (!subscription?.endpoint) {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
  }

  pushStore.add(subscription);

  // 구독 확인 알림 발송
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: '🔔 NexusInsight 알림 구독 완료',
        body: '새로운 RWA·양자·우주 인사이트를 실시간으로 받아보세요.',
        url: '/',
        icon: '/icons/icon-192.png',
      }),
    );
  } catch {
    // 알림 전송 실패해도 구독은 저장
  }

  return NextResponse.json({ ok: true, count: pushStore.count() });
}

export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json();
  if (endpoint) pushStore.remove(endpoint);
  return NextResponse.json({ ok: true });
}
