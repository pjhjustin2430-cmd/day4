// 공공데이터포털 「서귀포시 직영관광지 관람객수 추이」 를 받아 index.html 에 내장하는 스크립트
//
//   사용법 (인증키는 환경변수로만 전달 — 파일/깃에 저장되지 않습니다)
//     PowerShell :  $env:DATA_GO_KR_API_KEY="발급받은키" ; node scripts/update-visitors.mjs
//     bash       :  DATA_GO_KR_API_KEY=발급받은키 node scripts/update-visitors.mjs
//
//   결과: index.html 의 <!--VISITORS:BEGIN--> ~ <!--VISITORS:END--> 사이에 "공개 통계 데이터"만 들어갑니다.
//   (인증키는 들어가지 않으므로 GitHub Pages 같은 정적 호스팅에 올려도 안전합니다)
//   새 달 데이터가 나오면 이 스크립트를 다시 실행하면 됩니다.
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apiDir = ['jeju-ip-studio', 'jeju-ip'].map((d) => path.join(root, d, 'api', 'visitors.js')).find(existsSync)
if (!apiDir) throw new Error('api/visitors.js 를 찾을 수 없어요 (jeju-ip 또는 jeju-ip-studio 폴더 필요)')
if (!process.env.DATA_GO_KR_API_KEY) throw new Error('환경변수 DATA_GO_KR_API_KEY 가 필요해요.')

// 사이트에서 쓰는 서버리스 함수와 같은 코드를 그대로 재사용 (날짜 복원·두 파일 병합 로직 포함)
const { default: handler } = await import(pathToFileURL(apiDir).href)
let out, code = 200
await handler({}, { setHeader() {}, status(c) { code = c; return this }, json(o) { out = o; return this } })
if (code !== 200) throw new Error(out?.error || `응답 오류 ${code}`)

// 용량을 줄이기 위해 행을 배열로: [ym, 천지연, 정방, ...]  (순서는 spots 와 동일)
const compact = { updated: out.updated, spots: out.spots, rows: out.rows.map((r) => [r.ym, ...out.spots.map((s) => r.v[s])]) }
const json = JSON.stringify(compact).replace(/</g, '\\u003c')

const file = path.join(root, 'index.html')
const html = await readFile(file, 'utf8')
const re = /(<!--VISITORS:BEGIN-->)[\s\S]*?(<!--VISITORS:END-->)/
if (!re.test(html)) throw new Error('index.html 에 <!--VISITORS:BEGIN--> / <!--VISITORS:END--> 표시가 없어요.')
await writeFile(file, html.replace(re, `$1${json}$2`))
console.log(`✔ 관람객 데이터 ${compact.rows.length}개월 (${compact.rows[0][0]} ~ ${compact.rows.at(-1)[0]}) 을 index.html 에 넣었어요. (${(json.length / 1024).toFixed(1)}KB, 기준일 ${compact.updated})`)
