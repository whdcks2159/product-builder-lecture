-- ============================================================
-- NexusInsight · daily_news 테이블
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- 섹터 ENUM
CREATE TYPE sector_type AS ENUM ('quantum', 'space', 'robot', 'sto', 'fed', 'general');

-- 감성 ENUM
CREATE TYPE sentiment_type AS ENUM ('긍정', '부정', '중립');

-- ── 메인 테이블 ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_news (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT        NOT NULL,
  content_summary  TEXT,                              -- AI 3줄 요약 (줄바꿈 구분)
  target_sector    sector_type DEFAULT 'general',
  impact_score     SMALLINT    CHECK (impact_score BETWEEN 1 AND 10),
  sentiment        sentiment_type DEFAULT '중립',
  source_url       TEXT,
  source_name      TEXT,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),

  -- 동일 제목 중복 방지 (upsert 기준 키)
  CONSTRAINT daily_news_title_unique UNIQUE (title)
);

-- ── 인덱스 ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_daily_news_sector     ON daily_news (target_sector);
CREATE INDEX IF NOT EXISTS idx_daily_news_created_at ON daily_news (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_news_score      ON daily_news (impact_score DESC);

-- ── RLS (Row Level Security) ──────────────────────────────────────────────────
ALTER TABLE daily_news ENABLE ROW LEVEL SECURITY;

-- 공개 읽기: anon 키로 SELECT 허용
CREATE POLICY "public_read"
  ON daily_news FOR SELECT
  USING (true);

-- 서버 쓰기: service_role 키만 INSERT/UPDATE/DELETE 허용
-- (Next.js API Route에서 SUPABASE_SERVICE_ROLE_KEY 사용)
CREATE POLICY "service_write"
  ON daily_news FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── 오래된 뉴스 자동 삭제 함수 (30일 이상) ───────────────────────────────────
CREATE OR REPLACE FUNCTION delete_old_news()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM daily_news WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- pg_cron으로 매주 일요일 새벽 2시 자동 정리 (Supabase Pro에서 활성화)
-- SELECT cron.schedule('weekly-cleanup', '0 2 * * 0', 'SELECT delete_old_news()');
