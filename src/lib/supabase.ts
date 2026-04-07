import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ── 타입 정의 ─────────────────────────────────────────────────────────────────
export type Sector    = 'quantum' | 'space' | 'robot' | 'sto' | 'fed' | 'general';
export type Sentiment = '긍정' | '부정' | '중립';

export interface DailyNews {
  id:              string;
  title:           string;
  content_summary: string | null;
  target_sector:   Sector;
  impact_score:    number | null;
  sentiment:       Sentiment;
  source_url:      string | null;
  source_name:     string | null;
  published_at:    string | null;
  created_at:      string;
}

// ── 지연 초기화 (빌드 타임 오류 방지) ────────────────────────────────────────
let _publicClient: SupabaseClient | null = null;

/** 공개 클라이언트 — SELECT 전용, 클라이언트/서버 모두 사용 가능 */
export function getSupabase(): SupabaseClient {
  if (_publicClient) return _publicClient;

  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  _publicClient = createClient(url, anon);
  return _publicClient;
}

/** 관리자 클라이언트 — INSERT/UPDATE 가능, 서버 전용 (API Route에서만 사용) */
export function getAdminClient(): SupabaseClient {
  const url        = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase 서버 환경변수가 설정되지 않았습니다: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// ── 편의 re-export (기존 코드 호환) ──────────────────────────────────────────
/** @deprecated getSupabase() 사용 권장 */
export const supabase = {
  from: (...args: Parameters<SupabaseClient['from']>) => getSupabase().from(...args),
};
