/**
 * scripts/fetch-stretch-images.mjs
 *
 * Pexels API를 이용해 스트레칭별 대표 사진을 수집하고
 * /public/stretch-images/ 에 저장한 뒤
 * src/data/stretch-photos.json 을 업데이트하는 스크립트.
 *
 * 사용법:
 *   PEXELS_API_KEY=your_key node scripts/fetch-stretch-images.mjs
 *   또는
 *   PEXELS_API_KEY=your_key node scripts/fetch-stretch-images.mjs --id hamstring-stretch
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── 설정 ───────────────────────────────────────────────────────
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const OUTPUT_DIR = path.join(ROOT, 'public', 'stretch-images');
const PHOTOS_JSON = path.join(ROOT, 'src', 'data', 'stretch-photos.json');
const TARGET_SIZE = 'medium'; // small | medium | large | original

// ── 스트레칭 ID → 영어 검색 키워드 매핑 ─────────────────────
export const STRETCH_KEYWORDS = {
  // ── 러닝 ─────────────────────────────────────────────────────
  'ankle-circles':        'ankle rotation warm up exercise fitness',
  'calf-stretch-before':  'calf stretch wall exercise fitness photo',
  'hip-flexor-before':    'hip flexor lunge stretch fitness photo',
  'leg-swing':            'leg swing dynamic warm up fitness photo',
  'hamstring-stretch':    'seated hamstring stretch exercise photo',
  'it-band-stretch':      'IT band stretch side lean exercise photo',
  'glute-stretch':        'glute pigeon pose stretch fitness photo',
  'calf-cooldown':        'calf stretch cool down fitness photo',

  // ── 웨이트 트레이닝 ───────────────────────────────────────────
  'shoulder-circle':      'shoulder rotation warm up exercise fitness',
  'chest-opener':         'chest opener doorway stretch fitness photo',
  'wrist-warmup':         'wrist stretch warm up exercise photo',
  'hip-warmup-weight':    'hip flexor warm up stretch fitness photo',
  'chest-stretch':        'chest stretch arms back exercise photo',
  'lat-stretch':          'lat stretch overhead side bend fitness',
  'tricep-stretch':       'tricep overhead stretch fitness photo',
  'quad-hamstring':       'quad hamstring stretch standing fitness photo',

  // ── 축구 ──────────────────────────────────────────────────────
  'jogging-warmup':       'jogging warm up running exercise fitness',
  'ankle-warmup-soccer':  'ankle mobility warm up soccer fitness',
  'groin-stretch':        'groin inner thigh stretch exercise photo',
  'hip-rotation':         'hip rotation dynamic stretch fitness photo',
  'hamstring-soccer':     'hamstring stretch soccer athlete fitness',
  'quad-stretch-soccer':  'quad stretch standing athlete fitness photo',
  'calf-soccer':          'calf stretch athlete cool down fitness',
  'full-body-stretch-soccer': 'full body cool down stretch fitness photo',

  // ── 하이킹 ────────────────────────────────────────────────────
  'march-step':           'high knee march warm up exercise fitness',
  'ankle-hiking':         'ankle warm up hike fitness photo',
  'quad-warmup-hiking':   'quad stretch hiker fitness photo',
  'hip-hiking':           'hip flexor stretch hiker fitness photo',
  'knee-care-hiking':     'knee care stretch hike exercise photo',
  'calf-hiking':          'calf stretch trail running fitness photo',
  'it-band-hiking':       'IT band stretch hiker fitness photo',
  'back-after-hiking':    'lower back stretch after hiking fitness',

  // ── 골프 ──────────────────────────────────────────────────────
  'torso-rotation':       'torso trunk rotation stretch golf fitness',
  'shoulder-golf':        'shoulder stretch golf warm up fitness',
  'hip-golf':             'hip rotation stretch golf fitness photo',
  'wrist-golf':           'wrist forearm stretch golf fitness photo',
  'back-golf':            'back stretch golf fitness photo',
  'thoracic-golf':        'thoracic spine mobility golf fitness',
  'forearm-golf':         'forearm stretch golf tennis fitness photo',
  'piriformis-golf':      'piriformis stretch lying figure four exercise',

  // ── 요가 ──────────────────────────────────────────────────────
  'yoga-breath-prep':     'yoga breathing meditation preparation photo',
  'cat-cow-yoga':         'cat cow yoga pose stretch photo',
  'child-pose-yoga':      'child pose yoga stretch fitness photo',
  'pigeon-prep-yoga':     'pigeon pose yoga hip stretch photo',
  'savasana':             'savasana corpse pose yoga relaxation photo',
  'supine-twist-yoga':    'supine spinal twist yoga stretch photo',
  'seated-forward-fold':  'seated forward fold yoga stretch photo',
  'legs-up-wall':         'legs up wall yoga pose photo',

  // ── 통증 부위 ─────────────────────────────────────────────────
  'lower-back':           'lower back stretch exercise fitness photo',
  'knee':                 'knee stretch rehabilitation exercise photo',
  'shoulder':             'shoulder stretch physical therapy photo',
  'calf':                 'calf stretch exercise fitness photo',
  'hip':                  'hip stretch flexibility exercise fitness',
  'neck':                 'neck stretch exercise fitness photo',

  // ── 허리 디스크 ───────────────────────────────────────────────
  'knee-to-chest-bp':     'knee to chest lower back stretch exercise',
  'cat-cow-bp':           'cat cow back exercise rehabilitation photo',
  'child-pose-bp':        'child pose lower back relief fitness photo',
  'spinal-twist-bp':      'supine spinal twist exercise fitness photo',
  'dead-bug-bp':          'dead bug core exercise fitness photo',
  'bird-dog-bp':          'bird dog exercise fitness rehabilitation',
  'glute-bridge-bp':      'glute bridge exercise fitness rehabilitation',
  'plank-modified-bp':    'modified plank knee core exercise fitness',
  'pelvic-floor-bp':      'pelvic floor exercise fitness rehabilitation',

  // ── 통증 부위 개별 ─────────────────────────────────────────────
  'knee-to-chest-pain':   'knee to chest stretch lower back exercise',
  'cat-cow-pain':         'cat cow exercise lower back fitness photo',
  'child-pose-pain':      'child pose lower back stretch fitness photo',
  'spinal-twist-pain':    'spinal twist stretch exercise fitness photo',
  'piriformis-pain':      'piriformis figure four stretch fitness photo',
  'quad-stretch-knee':    'quad stretch standing fitness photo',
  'it-band-knee':         'IT band side stretch fitness photo',
  'hamstring-knee':       'hamstring stretch seated fitness photo',
  'calf-knee':            'calf stretch wall fitness photo',
  'glute-bridge-knee':    'glute bridge exercise fitness photo',
  'cross-body-shoulder':  'cross body shoulder stretch fitness photo',
  'chest-opener-shoulder':'chest opener stretch doorway fitness photo',
  'neck-shoulder':        'neck side stretch fitness photo',
  'shoulder-rotation':    'shoulder external rotation stretch fitness',
  'thoracic-shoulder':    'thoracic mobility exercise fitness photo',
  'standing-calf':        'standing calf stretch wall fitness photo',

  // ── 사이클링 ─────────────────────────────────────────────────
  'neck-warmup-cycling':  'neck shoulder warm up cycling fitness',
  'hip-flexor-cycling':   'hip flexor lunge stretch cycling fitness',
  'back-warmup-cycling':  'lower back warm up stretch fitness photo',
  'knee-circle-cycling':  'knee circle mobility exercise fitness',
  'back-stretch-cycling': 'lower back stretch fitness photo',
  'hip-flexor-after-cycling': 'hip flexor stretch fitness photo',
  'quad-stretch-cycling': 'quad stretch standing fitness photo',
  'neck-shoulder-after-cycling': 'neck side stretch fitness photo',

  // ── 농구 ─────────────────────────────────────────────────────
  'jump-prep-bball':      'jump preparation warm up fitness photo',
  'arm-circle-bball':     'arm circle shoulder warm up fitness photo',
  'lateral-lunge-bball':  'lateral lunge side squat fitness photo',
  'ankle-prep-bball':     'ankle warm up exercise fitness photo',
  'hip-flexor-after-bball': 'hip flexor stretch fitness photo',
};

// ── Pexels API 호출 ──────────────────────────────────────────
async function searchPexels(query, perPage = 5) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: PEXELS_API_KEY } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// ── 이미지 다운로드 ──────────────────────────────────────────
async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      // redirect 처리
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// ── 사진 품질 점수 계산 (가로형, 고해상도 우선) ──────────────
function scorePhoto(photo) {
  let score = 0;
  const w = photo.width, h = photo.height;
  if (w >= 1200) score += 3;
  else if (w >= 800) score += 1;
  if (w > h) score += 2; // 가로형 선호
  return score;
}

// ── 단일 스트레칭 처리 ───────────────────────────────────────
async function processStretch(id, keyword, photosMap) {
  if (photosMap[id]) {
    console.log(`  ⏭  ${id}: 이미 처리됨`);
    return;
  }

  console.log(`  🔍 ${id}: "${keyword}" 검색 중...`);
  try {
    const result = await searchPexels(keyword);
    if (!result.photos || result.photos.length === 0) {
      console.log(`  ⚠️  ${id}: 결과 없음`);
      return;
    }

    // 가장 적합한 사진 선택
    const best = result.photos.sort((a, b) => scorePhoto(b) - scorePhoto(a))[0];
    const imageUrl = best.src[TARGET_SIZE];
    const fileName = `${id}.jpg`;
    const destPath = path.join(OUTPUT_DIR, fileName);

    await downloadImage(imageUrl, destPath);

    photosMap[id] = {
      photo_url: `/stretch-images/${fileName}`,
      photo_credit: best.photographer,
      photo_credit_url: best.photographer_url,
      photo_source: 'Pexels',
      photo_source_url: best.url,
      pexels_id: best.id,
      original_url: best.src.original,
    };
    console.log(`  ✅ ${id}: 저장 완료 (by ${best.photographer})`);
  } catch (err) {
    console.error(`  ❌ ${id}: 오류 - ${err.message}`);
  }
}

// ── 메인 ─────────────────────────────────────────────────────
async function main() {
  if (!PEXELS_API_KEY) {
    console.error('❌ PEXELS_API_KEY 환경변수가 설정되지 않았습니다.');
    console.error('   사용법: PEXELS_API_KEY=your_key node scripts/fetch-stretch-images.mjs');
    process.exit(1);
  }

  // 출력 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 디렉토리 생성: ${OUTPUT_DIR}`);
  }

  // 기존 photos.json 로드
  let photosMap = {};
  if (fs.existsSync(PHOTOS_JSON)) {
    photosMap = JSON.parse(fs.readFileSync(PHOTOS_JSON, 'utf-8'));
  }

  // 특정 ID만 처리 (--id 플래그)
  const idArg = process.argv.indexOf('--id');
  const targetIds = idArg !== -1
    ? [process.argv[idArg + 1]]
    : Object.keys(STRETCH_KEYWORDS);

  // --reset 플래그로 기존 데이터 초기화
  if (process.argv.includes('--reset')) {
    photosMap = {};
    console.log('🔄 기존 사진 데이터 초기화');
  }

  console.log(`\n🚀 총 ${targetIds.length}개 스트레칭 사진 수집 시작\n`);

  for (const id of targetIds) {
    const keyword = STRETCH_KEYWORDS[id];
    if (!keyword) {
      console.log(`  ⚠️  ${id}: 키워드 없음 (STRETCH_KEYWORDS에 추가 필요)`);
      continue;
    }
    await processStretch(id, keyword, photosMap);
    // API rate limit 방지 (Pexels: 200 req/hour)
    await new Promise((r) => setTimeout(r, 400));
  }

  // JSON 저장
  fs.writeFileSync(PHOTOS_JSON, JSON.stringify(photosMap, null, 2), 'utf-8');
  console.log(`\n✅ 완료! ${Object.keys(photosMap).length}개 사진 정보 저장됨`);
  console.log(`📄 ${PHOTOS_JSON}`);
}

main();
