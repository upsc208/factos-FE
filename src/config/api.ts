/**
 * 백엔드 주소.
 *
 * - 브라우저: `NEXT_PUBLIC_API_URL` (빌드 때 박힌다). 운영(Docker Compose)은 **빈 값** → 같은 출처 `/api`로 부르고
 *   nginx가 백엔드로 넘긴다. 로컬 개발은 값이 없으면 `http://localhost:8080`.
 * - 서버(SSR): `INTERNAL_API_URL` (실행 때 읽는다). 운영은 `http://backend:8080` — 내부망으로 바로 부른다.
 *   nginx·Cloudflare를 거쳐 밖으로 나갔다 들어오지 않게.
 */
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

function trim(url: string) {
  return url.replace(/\/$/, '');
}

export function apiBase(): string {
  if (typeof window === 'undefined') {
    return trim(process.env.INTERNAL_API_URL || PUBLIC_API_URL || 'http://localhost:8080');
  }
  // 빈 문자열은 "같은 출처"라는 뜻이라 ?? 로 받는다
  return trim(PUBLIC_API_URL ?? 'http://localhost:8080');
}
