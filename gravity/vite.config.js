import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true
  },
  plugins: [
    vue(),
    vueDevTools({
      // Use the wrapper script to handle file:line:column formatting
      launchEditor: fileURLToPath(new URL("./launch-editor.cmd", import.meta.url)),
    }),
  ],
})
