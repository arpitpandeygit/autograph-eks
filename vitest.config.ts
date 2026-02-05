import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    testTimeout: 60000, // 60s for Strapi startup tests
    hookTimeout: 60000,
  },
});
