import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ** have to add this below for use tailwind css
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})
