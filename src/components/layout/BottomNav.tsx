'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Database, Search, Wrench } from 'lucide-react';

const navItems = [
  { href: '/',              icon: Home,      label: 'Home'   },
  { href: '/sectors',       icon: BarChart2, label: '섹터'   },
  { href: '/news-feed',     icon: Database,  label: 'DB뉴스' },
  { href: '/news-analyzer', icon: Search,    label: 'AI분석' },
  { href: '/calculator',    icon: Wrench,    label: '도구'   },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bottom-nav"
      style={{
        background: 'rgba(5,10,20,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-lg mx-auto flex items-stretch">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all"
              style={{ color: active ? '#60a5fa' : 'rgba(148,163,184,0.6)' }}
            >
              <div
                className="flex items-center justify-center rounded-xl transition-all"
                style={{
                  width: 36,
                  height: 28,
                  background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
