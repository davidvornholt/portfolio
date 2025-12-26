import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {},
};

// Run Velite before the build
const runVelite = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production' || process.argv.includes('dev')) {
    const { build } = await import('velite');
    await build({
      watch: process.argv.includes('dev'),
      clean: !process.argv.includes('dev'),
    });
  }
};

runVelite();

export default nextConfig;
