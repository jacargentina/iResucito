import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Separate from vite.config.ts so tests do not load the Remix/Vercel plugins.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    environment: 'node',
  },
});
