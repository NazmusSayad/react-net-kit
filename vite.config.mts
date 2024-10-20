import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  root: path.join(__dirname, './dev'),
  server: { host: 'localhost', port: 3000 },
})
