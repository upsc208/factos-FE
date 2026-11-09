import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 로그인한 사람만 의미 있는 화면
      disallow: ['/me', '/signup', '/admin', '/*/bookmarks'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
