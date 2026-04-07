import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function SubHeader() {
  return (
    <header className="sticky top-0 z-40"
      style={{ background: 'rgba(7,13,26,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
            <Activity size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm">
            Nexus<span style={{ background: 'linear-gradient(90deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Insight</span>
          </span>
        </Link>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          <span style={{ color: 'rgba(148,163,184,0.7)' }}>Live</span>
        </div>
      </div>
    </header>
  );
}
