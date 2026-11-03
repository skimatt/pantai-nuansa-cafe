import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'tests/e2e',fullyParallel:false,workers:1,timeout:45000,
  reporter:[['list'],['json',{outputFile:'evidence/test-runs/e2e-results.json'}]],
  use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',headless:true,trace:'retain-on-failure'},
  webServer:{command:'npm run preview',url:'http://127.0.0.1:4173',reuseExistingServer:true,timeout:30000},
});
