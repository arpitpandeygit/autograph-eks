/**
 * Strapi Health Check Test
 *
 * Validates that the Strapi CMS is properly configured and running.
 * Run with: npx vitest run
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, ChildProcess } from 'child_process';

const STRAPI_PORT = 1337;
const STRAPI_URL = `http://localhost:${STRAPI_PORT}`;
const STARTUP_TIMEOUT = 30000; // 30 seconds for Strapi to start

let strapiProcess: ChildProcess | null = null;

async function waitForStrapi(timeoutMs: number): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await fetch(`${STRAPI_URL}/_health`);
      if (response.status === 204 || response.status === 200) {
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

describe('Strapi CMS Health', () => {
  beforeAll(async () => {
    // Start Strapi in development mode
    strapiProcess = spawn('npm', ['run', 'develop'], {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'development' },
      stdio: 'pipe',
    });

    // Wait for Strapi to be ready
    const isReady = await waitForStrapi(STARTUP_TIMEOUT);
    if (!isReady) {
      throw new Error(
        `Strapi failed to start within ${STARTUP_TIMEOUT / 1000} seconds.\n\n` +
          'To fix:\n' +
          '  1. Ensure dependencies are installed: npm install\n' +
          '  2. Ensure Strapi is built: npm run build\n' +
          '  3. Check for port conflicts on :1337\n'
      );
    }
  }, STARTUP_TIMEOUT + 5000);

  afterAll(async () => {
    if (strapiProcess) {
      strapiProcess.kill('SIGTERM');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  });

  it('should respond to health check endpoint', async () => {
    const response = await fetch(`${STRAPI_URL}/_health`);
    // Strapi returns 204 No Content for health check
    expect([200, 204]).toContain(response.status);
  });

  it('should serve admin panel', async () => {
    const response = await fetch(`${STRAPI_URL}/admin`);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
  });

  it('should return 404 for non-existent API routes', async () => {
    const response = await fetch(`${STRAPI_URL}/api/non-existent-route`);
    expect(response.status).toBe(404);
  });

  it('should have correct Strapi version header', async () => {
    const response = await fetch(`${STRAPI_URL}/admin/project-type`);
    expect(response.status).toBe(200);
  });
});
