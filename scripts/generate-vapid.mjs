/**
 * VAPID 키 생성 스크립트
 * 실행: node scripts/generate-vapid.mjs
 * 또는: npx web-push generate-vapid-keys
 */
import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();

console.log('\n✅ VAPID 키 생성 완료\n');
console.log('아래 값을 .env.local 에 복사하세요:\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log('\n⚠️  privateKey는 절대 공개 저장소에 커밋하지 마세요!\n');
