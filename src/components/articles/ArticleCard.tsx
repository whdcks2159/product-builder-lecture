import Link from 'next/link';
import { Article } from '@/data/articles';
import { sectors } from '@/data/sectors';
import { Clock, ArrowRight } from 'lucide-react';

interface Props {
  article: Article;
  compact?: boolean;
}

export default function ArticleCard({ article, compact = false }: Props) {
  const sector = sectors.find(s => s.id === article.sector)!;

  if (compact) {
    return (
      <Link href={`/insights/${article.slug}`}>
        <div className="flex gap-3 py-3 card-hover rounded-lg px-1" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
            style={{ background: `${sector.color}15` }}>
            {sector.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: `${sector.color}15`, color: sector.color }}>
                {sector.nameKo.split(' ')[0]}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                <Clock size={9} className="inline mr-0.5" />{article.readTime}
              </span>
            </div>
            <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
              {article.title}
            </p>
          </div>
          <ArrowRight size={14} className="mt-1 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/insights/${article.slug}`}>
      <div className="rounded-xl p-4 card-hover h-full flex flex-col"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">{sector.icon}</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: `${sector.color}15`, color: sector.color }}>
            {sector.nameKo}
          </span>
          {article.featured && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
              ★ 추천
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold leading-snug mb-2 flex-1" style={{ color: 'var(--text-primary)' }}>
          {article.title}
        </h3>
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>{article.author} · {article.authorTitle}</span>
          <span className="flex items-center gap-1">
            <Clock size={10} />{article.readTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
