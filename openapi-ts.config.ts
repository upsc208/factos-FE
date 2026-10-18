import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: 'http://localhost:8080/v3/api-docs', // 스프링부트의 OpenAPI JSON 경로
    output: 'src/client',
    plugins: [
        '@hey-api/typescript',
        '@hey-api/sdk',
        {
            name: '@hey-api/client-fetch',
            baseUrl: 'http://localhost:8080',
            runtimeConfigPath: './src/client-config',
        },
    ],
});
