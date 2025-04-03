import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths';
// import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
    // server: {
    //     https: {
    //         key: fs.readFileSync("/Users/fan/Documents/Wontopia/certs/private.key.pem", "utf-8"),
    //         cert: fs.readFileSync("/Users/fan/Documents/Wontopia/certs/domain.cert.pem", "utf-8"),
    //     },
    //     host: "internal.wontopia.win", // Ensure it runs on localhost
    //     port: 5137, // Change if needed
    // },
    plugins: [
        react(),
        tsconfigPaths(),
        nodePolyfills({
            globals: {
                Buffer: true,
            },
        }) ],
    build: {
        outDir: './dist',
    },
    base: '/',
})
