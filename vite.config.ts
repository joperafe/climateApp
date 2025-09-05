import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// replace with your GitHub repo name
const repoName = 'climateApp'

export default defineConfig({
  plugins: [react(), tailwind()],
  base: `/${repoName}`,   // 👈 crucial for GitHub Pages
  server: {
    port: 5173
  }
})
