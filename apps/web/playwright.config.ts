import { createA11yPlaywrightConfig } from '@davidvornholt/a11y-testing/playwright-config';

const port = 3308;

export default createA11yPlaywrightConfig({
  baseUrl: `http://127.0.0.1:${port}`,
  webServerCommand: `bun run start --port ${port}`,
});
