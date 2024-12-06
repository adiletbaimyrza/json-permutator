import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://adiletbaimyrza.github.io/json-permutator/',
  plugins: [react()],
})
