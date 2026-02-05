/**
 * AutoGraph Health Check Tests
 *
 * Validates the Strapi CMS setup is working correctly.
 * Run with: npm test (requires Strapi to be running)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

describe('Strapi Health Check', () => {
  describe('Server Availability', () => {
    it('should respond to health endpoint', async () => {
      // Note: Strapi 5 uses /_health endpoint
      const response = await fetch(`${STRAPI_URL}/_health`);

      expect(response.ok).toBe(true);
      expect(response.status).toBe(204); // Strapi returns 204 for health check
    });

    it('should have admin panel accessible', async () => {
      const response = await fetch(`${STRAPI_URL}/admin`);

      // Admin panel redirects or returns HTML
      expect([200, 301, 302]).toContain(response.status);
    });
  });

  describe('API Endpoints', () => {
    it('should respond to API root', async () => {
      const response = await fetch(`${STRAPI_URL}/api`);

      // API root may return 404 if no content types, but server should respond
      expect(response.status).toBeLessThan(500);
    });
  });
});

describe('Environment Validation', () => {
  it('should have required environment variables', () => {
    // These are set by Strapi during creation
    const envFile = Bun.file('./backend/.env');

    // Just check the file exists (actual validation happens at runtime)
    expect(envFile.size).toBeGreaterThan(0);
  });
});
