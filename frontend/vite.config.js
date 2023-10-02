import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import 'vite/modulepreload-polyfill'

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})

// export default defineConfig({
//   build: {
//     // generate manifest.json in outDir
//     manifest: true,
//     rollupOptions: {
//       // overwrite default .html entry
//       input: '/path/to/main.js',
//     },
//   },
// })

