'use client';
import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: 'rgba(7,13,26,0.85)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <Activity size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Nexus<span className="gradient-text-blue">Insight</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
            <span style={{ color: 'var(--text-secondary)' }}>Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
