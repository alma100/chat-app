import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      server: { https: true },
      watch: {
        usePolling: true,
      },
      host: true, 
      proxy: {
        '/api': {
          target: env.BACKEND_URL || 'http://localhost:5129',
          changeOrigin: true,
          credentials: true,
        },
        '/ws': {
          target: env.BACKEND_URL || 'http://localhost:5102', //http://localhost:5102/ws/Message/GetAllChatMessage
          changeOrigin: true,
          credentials: true,
        },
      },
    },
  };
});
