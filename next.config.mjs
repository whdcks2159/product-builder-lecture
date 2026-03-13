/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Vercel / CDN deployment
  // output: 'export',  // ← 정적 배포 시 주석 해제

  images: {
    remotePatterns: [
      // Pexels CDN (fetch-stretch-images 스크립트로 수집한 사진 미리보기용)
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};

export default nextConfig;
