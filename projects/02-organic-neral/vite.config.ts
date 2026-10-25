import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  server: {
    port: 3002,
  },
});
