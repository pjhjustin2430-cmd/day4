import { useId, useState } from 'react'

// 숫자를 한국식으로 줄여서 표시: 123,456 → 12만, 52,310 → 5.2만
export const man = (n) => {
  if (n == null) return '–'
  if (n >= 100000) return `${Math.round(n / 10000).toLocaleString('ko-KR')}만`
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`
  return Math.round(n).toLocaleString('ko-KR')
}
export const num = (n) => (n == null ? '미집계' : `${Math.round(n).toLocaleString('ko-KR')}명`)

// 막대 색을 어둡게 (최고 월 강조용). 관광지 색이 무엇이든 "더 진한 같은 계열"이라 구분됨
function darken(hex, k = 0.62) {
  const n = parseInt(hex.replace('#', ''), 16)
  const c = (v) => Math.round(v * k).toString(16).padStart(2, '0')
  return `#${c((n >> 16) & 255)}${c((n >> 8) & 255)}${c(n & 255)}`
}

// 눈금이 깔끔하게 떨어지도록 최댓값을 올림
function niceMax(v) {
  if (v <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(v))
  const f = v / p
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p
}

/**
 * 세로 막대 차트 (SVG, 외부 라이브러리 없음)
 * data: [{ label, value(null=미집계), tick(축에 표시할 글자), note(툴팁 추가 문구), hot(강조) }]
 */
export function BarChart({ data, color = '#0e7c86', height = 280, width = 900 }) {
  const uid = useId().replace(/:/g, '')
  const [hov, setHov] = useState(null)
  const W = width, H = height, L = 52, R = 10, T = 16, B = 30
  const iw = W - L - R, ih = H - T - B, bw = iw / Math.max(1, data.length)
  const max = niceMax(Math.max(0, ...data.map((d) => d.value ?? 0)))
  const y = (v) => T + ih - (v / max) * ih
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max)
  const h = hov != null ? data[hov] : null

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="막대 차트" onMouseLeave={() => setHov(null)}>
        <defs>
          <pattern id={`hatch-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#f1ece0" /><rect width="2" height="6" fill="#d8cfbb" />
          </pattern>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="grid-line" />
            <text x={L - 8} y={y(t) + 4} textAnchor="end" className="axis-text">{man(t)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = L + i * bw, w = Math.max(1, bw * 0.78), bx = x + (bw - w) / 2
          return (
            <g key={i}>
              {d.value == null
                ? <rect x={bx} y={T + ih - 14} width={w} height={14} fill={`url(#hatch-${uid})`} />
                : <rect x={bx} y={y(d.value)} width={w} height={Math.max(0, T + ih - y(d.value))} rx={Math.min(3, w / 3)} fill={d.hot ? darken(color) : color} opacity={hov == null || hov === i ? 1 : 0.55} />}
              {d.hot && d.value != null && <text x={x + bw / 2} y={y(d.value) - 5} textAnchor="middle" className="peak-star">★</text>}
              {d.tick && <text x={x + bw / 2} y={H - 9} textAnchor="middle" className="axis-text">{d.tick}</text>}
              <rect x={x} y={T} width={bw} height={ih} fill="transparent" onMouseEnter={() => setHov(i)} onClick={() => setHov(i)} />
            </g>
          )
        })}
        {h && (() => {
          const tw = 190, tx = Math.min(Math.max(L + (hov + 0.5) * bw - tw / 2, L), W - R - tw)
          return (
            <g transform={`translate(${tx}, ${T - 4})`} pointerEvents="none">
              <rect width={tw} height={h.note ? 52 : 40} rx="8" className="tip-box" />
              <text x="10" y="17" className="tip-title">{h.label}</text>
              <text x="10" y="34" className="tip-value">{num(h.value)}</text>
              {h.note && <text x="10" y="47" className="tip-note">{h.note}</text>}
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

/** 가로 순위 막대: items = [{ key, label, value, color }] */
export function RankBars({ items, selected, onSelect }) {
  const total = items.reduce((s, i) => s + (i.value || 0), 0)
  const max = Math.max(1, ...items.map((i) => i.value || 0))
  return (
    <ul className="rank">
      {items.map((it, idx) => (
        <li key={it.key}>
          <button className={`rank-row ${selected === it.key ? 'on' : ''}`} onClick={() => onSelect?.(it.key)}>
            <span className="rank-no">{idx + 1}</span>
            <span className="rank-name">{it.label}</span>
            <span className="rank-bar"><i style={{ width: `${((it.value || 0) / max) * 100}%`, background: it.color }} /></span>
            <span className="rank-val">{man(it.value)}<small>{total ? ` · ${Math.round(((it.value || 0) / total) * 100)}%` : ''}</small></span>
          </button>
        </li>
      ))}
    </ul>
  )
}
