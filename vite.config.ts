import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Encaminha /api → backend (evita CORS enquanto o front está em :5173 e a API em outra porta).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://127.0.0.1:8080'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
