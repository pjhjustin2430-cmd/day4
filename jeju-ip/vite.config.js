import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// 서버 전용 환경변수 (VITE_ 접두사가 없으므로 브라우저 번들에는 절대 들어가지 않습니다)
const SERVER_KEYS = ['PIXABAY_API_KEY', 'DATA_GO_KR_API_KEY']

// 개발 서버(npm run dev)에서도 Vercel 서버리스 함수(/api/*.js)와 똑같이 동작하게 해 주는 플러그인.
// 예) /api/pixabay → api/pixabay.js, /api/visitors → api/visitors.js
function devApi(env) {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost')
        const name = url.pathname.replace(/^\/+|\/+$/g, '')
        if (!/^[a-z0-9-]+$/i.test(name)) return next()
        try {
          // 주의: process.env 에 undefined 를 대입하면 문자열 "undefined" 가 되므로 값이 있을 때만 설정
          for (const k of SERVER_KEYS) if (env[k]) process.env[k] = env[k]
          const { default: handler } = await server.ssrLoadModule(`/api/${name}.js`)
          req.query = Object.fromEntries(url.searchParams)
          res.status = (code) => { res.statusCode = code; return res }
          res.json = (obj) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(obj)) }
          await handler(req, res)
        } catch (e) {
          res.statusCode = /Failed to load url|Cannot find/i.test(String(e)) ? 404 : 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: String(e) }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return { plugins: [react(), devApi(env)] }
})
