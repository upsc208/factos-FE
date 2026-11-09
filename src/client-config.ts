import type { Config } from './client/client/types.gen';
import { apiBase } from './config/api';

// 생성된 API 클라이언트도 member.ts와 같은 주소 규칙을 쓴다 (서버는 내부망, 브라우저는 같은 출처)
export const createClientConfig = (config: Config): Config => ({
  ...config,
  baseUrl: apiBase(),
});
