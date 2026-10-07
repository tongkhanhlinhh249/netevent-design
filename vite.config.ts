import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Landing page tĩnh nằm ở public/gioi-thieu (nhập bằng scripts/import_landing.py).
// Vercel tự trả index.html cho đường dẫn thư mục như /gioi-thieu/mini-game/,
// còn dev server của Vite thì trả về app — thêm đúng việc đó cho lúc chạy local.
function staticDirIndex(prefix) {
  return {
    name: 'static-dir-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = (req.url ?? '').split('?')
        if (pathname === prefix || (pathname.startsWith(prefix + '/') && pathname.endsWith('/'))) {
          req.url = pathname.replace(/\/?$/, '/index.html') + (query ? '?' + query : '')
        }
        next()
      })
    },
  }
}

export default defineConfig({
  // Cổng do môi trường cấp (PORT) khi có, không thì 5173 như mặc định của Vite.
  server: { port: Number(process.env.PORT) || 5173 },
  plugins: [
    staticDirIndex('/gioi-thieu'),
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
