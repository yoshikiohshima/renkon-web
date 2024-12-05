import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
          entry: resolve(__dirname, 'src/main.js'),
          formats: ["es"],
          name: 'Renkon-web',
          fileName: 'renkon',
        },
        minify: true,
//         rollupOptions: {
//            output: {
//                manualChunks: {
//                    typescript: ["typescript"]
//                }
//            }
//        }
    }
})
