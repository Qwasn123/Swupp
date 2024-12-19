import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/user': {
        target: 'https://swupp.swu.social',
        changeOrigin: true,
        secure: false,
        rejectUnauthorized: false,
        ws: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      '/file': {
        target: 'https://swupp.swu.social',
        changeOrigin: true,
        secure: false,
        rejectUnauthorized: false,
        ws: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      '/secondhand': {
        target: 'https://swupp.swu.social',
        changeOrigin: true,
        secure: false,
        rejectUnauthorized: false,
        ws: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      '/task': {
        target: 'https://swupp.swu.social',
        changeOrigin: true,
        secure: false,
        rejectUnauthorized: false,
        ws: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      '/upload': {
        target: 'https://upload.swu.social',
        changeOrigin: true,
        secure: false,
        rejectUnauthorized: false,
        ws: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      '/api': {
        target: 'http://swu.social',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/upload-api': {
        target: 'http://upload.swu.social',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload-api/, '')
      },
      '/data-api': {
        target: 'http://data.swu.social',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data-api/, '')
      },
      '/search': {
        target: 'https://swupp.swu.social',
        changeOrigin: true,
        secure: false,
        rejectUnauthorized: false,
        ws: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
  }
})
