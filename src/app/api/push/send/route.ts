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
  // 간단한 내부 API 키 검증 (프로덕션에서는 더 강력한 인증 필요)
  const authHeader = req.headers.get('authorization');
  const apiKey = process.env.PUSH_API_KEY;
  if (apiKey && authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!initVapid()) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  const body = await req.json();
  const payload = JSON.stringify({
    title: body.title || '📊 NexusInsight 새 인사이트',
    body:  body.body  || '새로운 분석 글이 업로드되었습니다.',
    url:   body.url   || '/',
    icon:  '/icons/icon-192.png',
  });

  const subscribers = pushStore.getAll();
  if (subscribers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: '구독자 없음' });
  }

  const results = await Promise.allSettled(
    subscribers.map(sub =>
      webpush.sendNotification(sub, payload).catch(err => {
        // 만료된 구독 제거
        if (err.statusCode === 404 || err.statusCode === 410) {
          pushStore.remove(sub.endpoint);
        }
        throw err;
      }),
    ),
  );

  const sent   = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return NextResponse.json({ ok: true, sent, failed, total: subscribers.length });
}
