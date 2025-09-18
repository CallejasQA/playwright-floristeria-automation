import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'https://www.floristeriamundoflor.com/', // 👈 agrega esta línea
    headless: true,
    trace: 'on-first-retry',
    //configuracion para grabar videos
    video: 'retain-on-failure',

    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    }
  ],
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]]
});
