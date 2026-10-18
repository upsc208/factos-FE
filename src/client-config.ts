import type { Config } from './client/client/types.gen';

export const createClientConfig = (config: Config): Config => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || config.baseUrl;
    console.log('[DEBUG] API Client Base URL:', baseUrl);
    return {
        ...config,
        baseUrl: baseUrl,
    };
};
