import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // 예시: 비공개 페이지가 있다면 추가
    },
    sitemap: 'https://atleti.kr/sitemap.xml',
  };
}
