import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadata as genMeta } from '@/lib/seo';
import { getArticle, articles } from '@/data/articles';
import { getSector } from '@/data/sectors';
import { Clock, User, Calendar, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle(params.slug);
  if (!article) return {};
  return genMeta({
    title: article.title,
    description: article.summary,
    path: `/insights/${article.slug}`,
  });
}

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-lg font-bold mt-6 mb-3" style={{ color: 'var(--text-primary)' }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-base font-semibold mt-4 mb-2" style={{ color: 'var(--text-primary)' }}>
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(
        <p key={key++} className="text-sm font-semibold mt-3 mb-1" style={{ color: 'var(--text-primary)' }}>
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="text-sm leading-relaxed ml-4 mb-1" style={{ color: 'var(--text-secondary)' }}>
          {line.slice(2)}
        </li>
      );
    } else if (line.startsWith('| ')) {
      // Skip table lines (simplified)
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />);
    } else {
      elements.push(
        <p key={key++} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {line}
        </p>
      );
    }
  }
  return elements;
}

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const sector = getSector(article.sector);

  return (
    <article className="max-w-3xl mx-auto px-4 py-5">
      {/* Back */}
      <Link href="/insights" className="inline-flex items-center gap-1.5 text-xs mb-5 hover:opacity-80"
        style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={14} /> 인사이트 목록
      </Link>

      {/* Sector Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">{sector.icon}</span>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: `${sector.color}15`, color: sector.color, border: `1px solid ${sector.color}25` }}>
          {sector.nameKo}
        </span>
        {article.featured && (
          <span className="text-xs px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            ★ 추천
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>
        {article.title}
      </h1>
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
        {article.subtitle}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs mb-5 pb-5" style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-1"><User size={11} />{article.author}</span>
        <span style={{ color: 'var(--border)' }}>·</span>
        <span>{article.authorTitle}</span>
        <span style={{ color: 'var(--border)' }}>·</span>
        <span className="flex items-center gap-1"><Calendar size={11} />{article.date}</span>
        <span style={{ color: 'var(--border)' }}>·</span>
        <span className="flex items-center gap-1"><Clock size={11} />{article.readTime} 읽기</span>
      </div>

      {/* Summary Box */}
      <div className="rounded-xl p-4 mb-6" style={{ background: `${sector.color}08`, border: `1px solid ${sector.color}20` }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: sector.color }}>요약: </span>
          {article.summary}
        </p>
      </div>

      {/* AdSense Placeholder */}
      <div className="mb-6 rounded-xl flex items-center justify-center text-xs"
        style={{ height: 90, background: 'var(--bg-card)', border: '1px dashed var(--border)', color: 'var(--text-secondary)' }}>
        Advertisement
      </div>

      {/* Content */}
      <div className="prose-custom">
        {renderMarkdown(article.content)}
      </div>

      {/* Tags */}
      <div className="mt-8 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <Tag size={12} style={{ color: 'var(--text-secondary)' }} />
          {article.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold">면책 조항:</span> 본 아티클은 정보 제공 목적으로만 작성되었으며 투자 조언이 아닙니다.
          모든 투자는 원금 손실 위험이 있으며, 투자 결정 전 전문 재무 상담사와 상담하시기 바랍니다.
        </p>
      </div>
    </article>
  );
}
