import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'
import * as fs from 'node:fs'


export default defineConfig(({ mode }) => {
    const isDev = mode === 'development'

    const basePath = isDev ? '/wontopia/' : '/'

    const commonConfig = {
        plugins: [
            react(),
            tsconfigPaths(),
            nodePolyfills({
                globals: {
                    Buffer: true,
                },
            }),
        ],
        build: {
            outDir: './dist',
        },
        base: basePath,
    }

    if (isDev) {
        return {
            ...commonConfig,
            server: {
                https: {
                    key: fs.readFileSync("/Users/fan/Documents/Wontopia/certs/private.key.pem", "utf-8"),
                    cert: fs.readFileSync("/Users/fan/Documents/Wontopia/certs/domain.cert.pem", "utf-8"),
                },
                host: "internal.wontopia.win",
                port: 5137,
            },
        }
    }

    return commonConfig
})