import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const buildConfig = process.env.BUILD_TYPE === "lib" ? {
  lib: {
    entry: resolve(__dirname, 'src/hooks/index.ts'),
    name: 'react-hooks',
    // the proper extensions will be added
    fileName: 'react-hooks'
  },
  rollupOptions: {
    // 确保外部化处理那些你不想打包进库的依赖
    external: ['react'],
    output: {
      // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      globals: {
        react: 'React'
      }
    }
  }
} : {
  rollupOptions: {
    input: resolve(__dirname, 'index.html'),
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "react-hooks",
  plugins: [react()],
  build: buildConfig
})
