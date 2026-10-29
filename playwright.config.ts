import { defineConfig, devices } from '@playwright/test';

// Uses the Chrome already installed on the machine (channel: 'chrome'), so no browser download is needed.
// The tests build the app into .next-e2e and serve it on port 3100, apart from any running `npm run dev`.
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3100',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: {
    command: 'npx next build && npx next start -p 3100',
    env: { NEXT_DIST_DIR: '.next-e2e', NEXT_TELEMETRY_DISABLED: '1' },
    url: 'http://localhost:3100/de',
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
