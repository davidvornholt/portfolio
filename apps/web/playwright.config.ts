import { createA11yPlaywrightConfig } from '@davidvornholt/a11y-testing/playwright-config';

export default createA11yPlaywrightConfig({
  baseUrl: 'http://127.0.0.1:3150',
  webServerCommand: 'bun run start --port 3150',
});
