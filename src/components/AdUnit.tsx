'use client';

// ────────────────────────────────────────────────────────────
//  AdUnit - Google AdSense 광고 컴포넌트
//
//  사용법:
//    <AdUnit slot="leaderboard" />        ← 상단/하단 (728×90)
//    <AdUnit slot="rectangle" />          ← 본문 중간 (300×250)
//    <AdUnit slot="banner" />             ← 섹션 사이 (468×60)
//
//  실제 AdSense 코드는 아래 TODO 위치에 삽입하세요.
// ────────────────────────────────────────────────────────────

type AdSlot = 'leaderboard' | 'rectangle' | 'banner';

interface AdUnitProps {
  slot: AdSlot;
  className?: string;
}

const slotConfig: Record<AdSlot, { minH: string; label: string }> = {
  leaderboard: { minH: 'min-h-[90px]',  label: '광고 (728×90)'  },
  rectangle:   { minH: 'min-h-[250px]', label: '광고 (300×250)' },
  banner:      { minH: 'min-h-[60px]',  label: '광고 (468×60)'  },
};

export default function AdUnit({ slot, className = '' }: AdUnitProps) {
  const { minH, label } = slotConfig[slot];

  return (
    <div className={`w-full py-2 ${className}`} aria-label="광고">
      <div
        className={`ad-placeholder ${minH} w-full max-w-2xl mx-auto rounded-lg`}
        style={{ minHeight: slotConfig[slot].minH.replace('min-h-[', '').replace(']', '') }}
      >
        {/* ── TODO: 실제 AdSense 코드를 아래에 삽입 ──────────────────────
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        ──────────────────────────────────────────────────────────────── */}
        <span className="text-xs text-gray-400 select-none">{label}</span>
      </div>
    </div>
  );
}
