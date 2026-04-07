'use client';

import { useState, useEffect } from 'react';
import { Bell, BellRing, BellOff, X, Loader2, AlertCircle } from 'lucide-react';

type SubState = 'checking' | 'idle' | 'requesting' | 'subscribed' | 'denied' | 'unsupported' | 'error';

function urlBase64ToUint8Array(base64: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr.buffer as ArrayBuffer;
}

function waitForSW(ms = 6000): Promise<ServiceWorkerRegistration> {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('서비스 워커 준비 시간 초과')), ms)
    ),
  ]);
}

export default function HeaderBell() {
  const [subState, setSubState] = useState<SubState>('checking');
  const [open, setOpen]         = useState(false);
  const [step, setStep]         = useState('');
  const [errorMsg, setError]    = useState('');

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      !('Notification' in window)
    ) { setSubState('unsupported'); return; }

    if (Notification.permission === 'denied') { setSubState('denied'); return; }

    navigator.serviceWorker.getRegistration('/').then(reg => {
      if (!reg) { setSubState('idle'); return; }
      reg.pushManager.getSubscription().then(sub => {
        setSubState(sub ? 'subscribed' : 'idle');
      }).catch(() => setSubState('idle'));
    }).catch(() => setSubState('idle'));
  }, []);

  const subscribe = async () => {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) { setError('VAPID 키 없음. 환경 변수를 확인하세요.'); setSubState('error'); return; }

    setSubState('requesting');
    setError('');
    try {
      setStep('알림 권한 요청 중...');
      const perm = await Notification.requestPermission();
      if (perm === 'denied') { setSubState('denied'); return; }
      if (perm !== 'granted') { setSubState('idle'); return; }

      setStep('서비스 워커 준비 중...');
      let reg = await navigator.serviceWorker.getRegistration('/');
      if (!reg) {
        reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        await new Promise<void>(resolve => {
          if (reg!.active) { resolve(); return; }
          const w = reg!.installing || reg!.waiting;
          if (!w) { resolve(); return; }
          w.addEventListener('statechange', function h() { if (this.state === 'activated') resolve(); });
          setTimeout(resolve, 3000);
        });
      }

      setStep('푸시 구독 중...');
      const sw  = await waitForSW();
      const sub = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      setStep('서버 등록 중...');
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      if (!res.ok) throw new Error(`서버 오류 ${res.status}`);

      setSubState('subscribed');
      setStep('');
    } catch (err: any) {
      setError(err?.message ?? '알 수 없는 오류');
      setSubState('error');
      setStep('');
    }
  };

  const unsubscribe = async () => {
    setSubState('requesting');
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
      setSubState('idle');
    } catch (err: any) {
      setError(err?.message ?? '해제 실패');
      setSubState('error');
    }
    setStep('');
  };

  const isSubscribed = subState === 'subscribed';
  const isLoading    = subState === 'checking' || subState === 'requesting';

  return (
    <div className="relative">
      {/* ── 종 아이콘 버튼 ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-opacity hover:opacity-80"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        aria-label="알림 설정"
      >
        {isLoading
          ? <Loader2 size={17} className="animate-spin" style={{ color: '#94a3b8' }} />
          : isSubscribed
            ? <BellRing size={17} style={{ color: '#34d399' }} />
            : subState === 'denied' || subState === 'unsupported'
              ? <BellOff size={17} style={{ color: '#64748b' }} />
              : <Bell size={17} style={{ color: '#94a3b8' }} />
        }
        {/* 뱃지: 미구독 상태일 때만 표시 */}
        {(subState === 'idle' || subState === 'error') && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
        )}
      </button>

      {/* ── 드롭다운 패널 ── */}
      {open && (
        <>
          {/* 외부 클릭 닫기 */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl p-4 shadow-2xl"
            style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* 패널 헤더 */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold" style={{ color: '#e2e8f0' }}>인사이트 알림</p>
              <button onClick={() => setOpen(false)} className="hover:opacity-60">
                <X size={14} style={{ color: '#64748b' }} />
              </button>
            </div>

            {/* 상태별 콘텐츠 */}
            {subState === 'unsupported' && (
              <p className="text-xs" style={{ color: '#64748b' }}>
                이 브라우저는 푸시 알림을 지원하지 않습니다.
              </p>
            )}

            {subState === 'denied' && (
              <div>
                <p className="text-xs mb-1.5" style={{ color: '#f87171' }}>알림 권한이 차단되어 있습니다.</p>
                <p className="text-[10px] leading-relaxed" style={{ color: '#64748b' }}>
                  브라우저 주소창 자물쇠 아이콘 → 알림 → 허용 후 새로고침
                </p>
              </div>
            )}

            {subState === 'error' && (
              <div className="space-y-2">
                <div className="flex items-start gap-1.5 text-xs" style={{ color: '#f87171' }}>
                  <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                  {errorMsg}
                </div>
                <button onClick={() => { setSubState('idle'); setError(''); }}
                  className="w-full py-1.5 rounded-lg text-xs transition-opacity hover:opacity-70"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                  다시 시도
                </button>
              </div>
            )}

            {(subState === 'checking' || subState === 'requesting') && (
              <div className="flex items-center gap-2 text-xs" style={{ color: '#94a3b8' }}>
                <Loader2 size={13} className="animate-spin" />
                {step || '처리 중...'}
              </div>
            )}

            {subState === 'subscribed' && (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-2.5 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <BellRing size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#34d399' }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#34d399' }}>구독 중</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>
                      새 RWA·양자·우주 인사이트 발행 시 알림을 받습니다.
                    </p>
                  </div>
                </div>
                <button onClick={unsubscribe}
                  className="w-full py-1.5 rounded-lg text-xs transition-opacity hover:opacity-70"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                  알림 구독 해제
                </button>
              </div>
            )}

            {subState === 'idle' && (
              <div className="space-y-3">
                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                  새로운 분석 아티클과 시장 업데이트를 실시간으로 받아보세요.
                </p>
                <button onClick={subscribe}
                  className="w-full py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(139,92,246,0.2))', border: '1px solid rgba(59,130,246,0.4)', color: '#60a5fa' }}>
                  🔔 알림 구독하기
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
