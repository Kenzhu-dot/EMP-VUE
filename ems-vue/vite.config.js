import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': { //请求路径中包含了/api
        target: 'http://localhost:8080', //要更换的源,也就是后台服务的源
        changeOrigin: true, //要不要更换源
        rewrite: (path) => path.replace(/^\/api/, '') //路径重写/api替换为’’
      }
    }
  }
})
