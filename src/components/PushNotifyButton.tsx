'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing, Loader2, AlertCircle } from 'lucide-react';

type State = 'checking' | 'idle' | 'requesting' | 'subscribed' | 'denied' | 'unsupported' | 'error';

function urlBase64ToUint8Array(base64: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr.buffer as ArrayBuffer;
}

// SW 준비 대기 (타임아웃 포함)
function waitForSW(ms = 6000): Promise<ServiceWorkerRegistration> {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('서비스 워커 준비 시간 초과 (6초)')), ms)
    ),
  ]);
}

export default function PushNotifyButton() {
  const [state, setState]   = useState<State>('checking');
  const [errorMsg, setError] = useState('');
  const [step, setStep]     = useState('');

  useEffect(() => {
    // 브라우저 지원 확인
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      !('Notification' in window)
    ) {
      setState('unsupported');
      return;
    }

    if (Notification.permission === 'denied') {
      setState('denied');
      return;
    }

    // 기존 구독 확인
    navigator.serviceWorker.getRegistration('/').then(reg => {
      if (!reg) { setState('idle'); return; }
      reg.pushManager.getSubscription().then(sub => {
        setState(sub ? 'subscribed' : 'idle');
      }).catch(() => setState('idle'));
    }).catch(() => setState('idle'));
  }, []);

  const subscribe = async () => {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!vapidKey) {
      setState('error');
      setError('VAPID 공개 키가 없습니다. Vercel 환경 변수를 확인하세요.');
      return;
    }

    setState('requesting');
    setError('');

    try {
      // 1단계: 알림 권한 요청
      setStep('알림 권한 요청 중...');
      const perm = await Notification.requestPermission();
      if (perm === 'denied') { setState('denied'); return; }
      if (perm !== 'granted') { setState('idle'); return; }

      // 2단계: 서비스 워커 등록 확인 (없으면 직접 등록)
      setStep('서비스 워커 준비 중...');
      let reg = await navigator.serviceWorker.getRegistration('/');
      if (!reg) {
        reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        // 활성화 대기
        await new Promise<void>(resolve => {
          if (reg!.active) { resolve(); return; }
          const worker = reg!.installing || reg!.waiting;
          if (!worker) { resolve(); return; }
          worker.addEventListener('statechange', function handler() {
            if (this.state === 'activated') { resolve(); }
          });
          setTimeout(resolve, 3000); // 3초 후 강제 진행
        });
      }

      // 3단계: Push 구독
      setStep('푸시 구독 등록 중...');
      const sw = await waitForSW(6000);
      const sub = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      // 4단계: 서버에 구독 저장
      setStep('서버 등록 중...');
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });

      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

      setState('subscribed');
      setStep('');
    } catch (err: any) {
      console.error('[Push] 구독 실패:', err);
      setState('error');
      setError(err?.message ?? '알 수 없는 오류가 발생했습니다.');
      setStep('');
    }
  };

  const unsubscribe = async () => {
    setState('requesting');
    setStep('구독 해제 중...');
    try {
      const reg = await navigator.serviceWorker.getRegistration('/');
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
      }
      setState('idle');
    } catch (err: any) {
      setState('error');
      setError(err?.message ?? '해제 중 오류가 발생했습니다.');
    }
    setStep('');
  };

  // ── 렌더링 ─────────────────────────────────────────────────────────────────

  if (state === 'checking') {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.4)' }}>
        <Loader2 size={13} className="animate-spin" />
        확인 중...
      </div>
    );
  }

  if (state === 'unsupported') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.4)' }}>
        <BellOff size={13} />
        이 브라우저는 푸시 알림을 지원하지 않습니다
      </div>
    );
  }

  if (state === 'denied') {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          <BellOff size={13} />
          알림 권한이 차단되었습니다
        </div>
        <p className="text-[10px] px-1" style={{ color: 'rgba(148,163,184,0.45)' }}>
          브라우저 주소창 왼쪽 자물쇠 아이콘 → 알림 → 허용 후 새로고침
        </p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl text-xs"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
        <button onClick={() => { setState('idle'); setError(''); }}
          className="w-full py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(148,163,184,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
          다시 시도
        </button>
      </div>
    );
  }

  if (state === 'subscribed') {
    return (
      <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="flex items-center gap-2">
          <BellRing size={14} style={{ color: '#34d399' }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: '#34d399' }}>알림 구독 중</p>
            <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.5)' }}>새 인사이트 발행 시 푸시 알림을 받습니다</p>
          </div>
        </div>
        <button onClick={unsubscribe}
          className="text-[10px] px-2 py-1 rounded-lg flex-shrink-0 transition-opacity hover:opacity-70"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
          해제
        </button>
      </div>
    );
  }

  if (state === 'requesting') {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold opacity-70"
          style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.15))', border: '1px solid rgba(59,130,246,0.35)', color: '#60a5fa' }}>
          <Loader2 size={14} className="animate-spin" />
          {step || '처리 중...'}
        </div>
      </div>
    );
  }

  // idle
  return (
    <button
      onClick={subscribe}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
      style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.15))', border: '1px solid rgba(59,130,246,0.35)', color: '#60a5fa' }}>
      <Bell size={14} />
      새 인사이트 알림 받기
    </button>
  );
}
