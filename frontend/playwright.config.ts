import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    // Definimos la URL base para no repetirla en cada test
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    /* 1. Test en Computadora (Chrome) */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* 2. Test en Celular Android (Pixel 5) */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    /* 3. Test en Celular iOS (iPhone 12) */
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Esto levanta tu Next.js automáticamente para los tests */
  webServer: {
    command: 'npm run dev', // Usamos dev para que los cambios se vean rápido
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Le damos 2 min por si tu PC está lenta
  },
});