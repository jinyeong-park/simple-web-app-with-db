import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend running on port 8081
      // This means that any request made to /todos (from your frontend running at http://localhost:5173/) will be proxied to http://localhost:8081/todos by Vite during development.
      '/todos': 'http://localhost:8081',
    },
  },
})
