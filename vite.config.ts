import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: false,
      rollupTypes: true,
      bundledPackages: ['chessground']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CaissifyChessground',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`
    },
    // Prevent CSS extraction for library builds
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', 'chessground'],
      output: {
        globals: {
          vue: 'Vue',
          chessground: 'Chessground'
        }
      }
    }
  },
  test: {
    environment: 'jsdom'
  }
})