import react from '@vitejs/plugin-react';
import { checker } from 'vite-plugin-checker';
import readableClassnames from 'vite-plugin-readable-classnames';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

import type { Plugin } from 'vite';

const GH_PAGES_BASE = '/react-burger/';

const spaFallback = (): Plugin => ({
  name: 'spa-fallback-404',
  apply: 'build',
  enforce: 'post',
  generateBundle(_options, bundle) {
    const index = bundle['index.html'];

    if (index?.type === 'asset') {
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: index.source,
      });
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    checker({
      typescript: true,
    }),
    react(),
    readableClassnames(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
    spaFallback(),
  ],
  base: command === 'build' ? GH_PAGES_BASE : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
  server: {
    open: true,
  },
}));
