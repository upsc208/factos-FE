/**
 * 서비스 주소 (사이트맵·robots·메타데이터의 절대 URL). 배포 환경변수 NEXT_PUBLIC_SITE_URL로 정한다.
 * 기본값은 layout.tsx에 있던 metadataBase 그대로다 — 운영 도메인이 정해지면 환경변수로 바꾼다.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://fipa-news.kr').replace(/\/$/, '');
