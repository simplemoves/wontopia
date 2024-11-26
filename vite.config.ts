import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    basicSsl(),
    nodePolyfills({
        globals: {
            Buffer: true
        }
    })],
  build: {
    outDir: './dist'
  },
  base: '/wontopia/'
})
