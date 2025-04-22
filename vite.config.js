import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sensorDataPlugin from './vite-sensor-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sensorDataPlugin()
  ],
})
