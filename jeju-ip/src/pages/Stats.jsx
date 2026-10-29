import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useVisitors } from '../hooks/useVisitors'
import { BarChart, RankBars, man, num } from '../components/charts.jsx'

const ALL = 'ALL'
const META = {
  '천지연폭포': { emoji: '🌊', color: '#0e7c86' },
  '정방폭포': { emoji: '💦', color: '#3b82c4' },
  '천제연폭포': { emoji: '🏞️', color: '#2f7d4f' },
  '중문대포 주상절리대': { emoji: '🪨', color: '#6b7280' },
  '산방산_용머리': { emoji: '⛰️', color: '#a0693a' },
  '감귤박물관': { emoji: '🍊', color: '#ff8a1f' },
}
const pretty = (s) => (s === ALL ? '전체 합계' : s.replace('_', ' '))
const ymLabel = (ym) => `${ym.slice(0, 4)}년 ${Number(ym.slice(5))}월`
const RANGES = [{ k: 'all', label: '전체', n: Infinity }, { k: '36', label: '최근 3년', n: 36 }, { k: '12', label: '최근 12개월', n: 12 }]

export default function Stats() {
  const { data, loading, error } = useVisitors()
  const [spot, setSpot] = useState(ALL)
  const [range, setRange] = useState('all')

  // 선택한 관광지의 월별 값 (전체 합계는 집계된 관광지만 더함 → 일부 미집계 달은 note 로 표시)
  const series = useMemo(() => {
    if (!data) return []
    return data.rows.map((r) => {
      const vals = data.spots.map((s) => r.v[s])
      const got = vals.filter((v) => v != null)
      if (spot === ALL) return { ym: r.ym, value: got.length ? got.reduce((a, b) => a + b, 0) : null, partial: got.length > 0 && got.length < data.spots.length }
      return { ym: r.ym, value: r.v[spot], partial: false }
    })
  }, [data, spot])

  const view = useMemo(() => {
    const n = RANGES.find((r) => r.k === range).n
    return series.slice(Math.max(0, series.length - n))
  }, [series, range])

  const stats = useMemo(() => {
    if (!series.length) return null
    const valid = series.filter((s) => s.value != null)
    const latest = valid.at(-1)
    const prevYm = `${Number(latest.ym.slice(0, 4)) - 1}${latest.ym.slice(4)}`
    const prev = series.find((s) => s.ym === prevYm)
    const yoy = prev?.value ? ((latest.value - prev.value) / prev.value) * 100 : null
    const last12 = series.slice(-12)
    const peak = valid.reduce((a, b) => (b.value > a.value ? b : a))
    return { latest, yoy, last12: last12.reduce((s, x) => s + (x.value || 0), 0), last12From: last12[0].ym, peak }
  }, [series])

  // 월별 추이 차트 데이터 (최고 월 강조, 1월마다 연도 표시)
  const trend = useMemo(() => {
    const max = Math.max(0, ...view.map((v) => v.value ?? 0))
    const dense = view.length <= 14
    return view.map((v) => ({
      label: ymLabel(v.ym), value: v.value, hot: v.value != null && v.value === max,
      tick: dense ? `${Number(v.ym.slice(5))}월` : v.ym.endsWith('-01') ? v.ym.slice(0, 4) : '',
      note: v.value == null ? '데이터 미집계' : v.partial ? '일부 관광지 미집계 → 합계가 낮을 수 있어요' : '',
    }))
  }, [view])

  // 계절성: 같은 달끼리 평균 (몇 월에 사람이 가장 많이 올까?)
  const season = useMemo(() => {
    const sum = Array(12).fill(0), cnt = Array(12).fill(0)
    series.forEach((s) => { if (s.value != null && !s.partial) { const m = Number(s.ym.slice(5)) - 1; sum[m] += s.value; cnt[m]++ } })
    const avg = sum.map((s, i) => (cnt[i] ? s / cnt[i] : null))
    const max = Math.max(0, ...avg.map((a) => a ?? 0))
    return avg.map((a, i) => ({ label: `${i + 1}월 평균`, value: a, tick: `${i + 1}월`, hot: a != null && a === max, note: `${cnt[i]}개 연도 평균` }))
  }, [series])

  // 관광지 순위: 최근 12개월 합계
  const rank = useMemo(() => {
    if (!data) return []
    const last = data.rows.slice(-12)
    return data.spots.map((s) => ({ key: s, label: `${META[s]?.emoji || ''} ${pretty(s)}`, color: META[s]?.color || '#0e7c86', value: last.reduce((a, r) => a + (r.v[s] || 0), 0) }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  const color = spot === ALL ? '#0e7c86' : META[spot]?.color

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">📊 제주 관광지 관람객 통계</h1>
        <p className="section-sub">서귀포시 직영 관광지 6곳의 월별 관람객 수예요. 몇 월에, 어디에 사람이 많이 올까요?</p>

        {loading && <div className="center-note">통계를 불러오는 중…</div>}
        {error && (
          <div className="notice notice-warn" style={{ width: 'auto', margin: '0 0 18px' }}>
            통계를 불러오지 못했어요: {error}
            {/DATA_GO_KR_API_KEY/.test(error) && <> — 환경변수 <code>DATA_GO_KR_API_KEY</code> 를 등록하고 다시 배포해 주세요.</>}
          </div>
        )}

        {data && stats && (
          <>
            <div className="chips spot-chips">
              {[ALL, ...data.spots].map((s) => (
                <button key={s} className={`chip chip-btn ${spot === s ? 'on' : ''}`} onClick={() => setSpot(s)} style={spot === s ? { background: s === ALL ? '#0e7c86' : META[s]?.color, borderColor: 'transparent' } : undefined}>
                  {s === ALL ? '🗺️' : META[s]?.emoji} {pretty(s)}
                </button>
              ))}
            </div>

            <div className="stat-cards">
              <div className="stat-card"><span>최근 월 ({ymLabel(stats.latest.ym)})</span><strong>{num(stats.latest.value)}</strong>
                {stats.yoy != null && <em className={stats.yoy >= 0 ? 'up' : 'down'}>작년 같은 달보다 {stats.yoy >= 0 ? '▲' : '▼'} {Math.abs(stats.yoy).toFixed(1)}%</em>}</div>
              <div className="stat-card"><span>최근 12개월 합계</span><strong>{num(stats.last12)}</strong><em>{ymLabel(stats.last12From)} ~ 최근</em></div>
              <div className="stat-card"><span>역대 최고 월</span><strong>{num(stats.peak.value)}</strong><em>{ymLabel(stats.peak.ym)}</em></div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h2>월별 관람객 추이 · {pretty(spot)}</h2>
                <div className="seg">{RANGES.map((r) => <button key={r.k} className={range === r.k ? 'on' : ''} onClick={() => setRange(r.k)}>{r.label}</button>)}</div>
              </div>
              <BarChart data={trend} color={color} />
              <p className="chart-note">★ 표시가 붙은 진한 막대가 이 기간의 최고 월이에요. 빗금은 데이터가 집계되지 않은 달입니다.{spot === ALL && ' 전체 합계는 집계된 관광지만 더한 값이에요.'}</p>
            </div>

            <div className="two-col">
              <div className="panel">
                <h2>몇 월이 가장 붐빌까? (월별 평균)</h2>
                <BarChart data={season} color={color} height={260} width={520} />
              </div>
              <div className="panel">
                <h2>관광지 순위 (최근 12개월)</h2>
                <RankBars items={rank} selected={spot} onSelect={setSpot} />
                <p className="chart-note">막대를 누르면 위 차트가 그 관광지로 바뀌어요.</p>
              </div>
            </div>

            <details className="panel table-panel">
              <summary>최근 12개월 표로 보기</summary>
              <div className="table-scroll">
                <table className="data-table">
                  <thead><tr><th>월</th>{data.spots.map((s) => <th key={s}>{pretty(s)}</th>)}<th>합계</th></tr></thead>
                  <tbody>
                    {[...data.rows].slice(-12).reverse().map((r) => {
                      const vals = data.spots.map((s) => r.v[s])
                      return <tr key={r.ym}><td>{r.ym}</td>{vals.map((v, i) => <td key={i}>{v == null ? '–' : v.toLocaleString('ko-KR')}</td>)}<td><strong>{vals.reduce((a, b) => a + (b || 0), 0).toLocaleString('ko-KR')}</strong></td></tr>
                    })}
                  </tbody>
                </table>
              </div>
            </details>

            <p className="source">
              출처: <a href="https://www.data.go.kr/" target="_blank" rel="noreferrer">공공데이터포털</a> · 제주특별자치도 서귀포시 「직영관광지 관람객수 추이」 (기준일 {data.updated || '-'}).
              {' '}원본 파일에 일부 월은 '미집계'로 비어 있어요. 이용 조건은 공공데이터포털의 해당 데이터 페이지를 확인해 주세요.
            </p>
            <p className="center"><Link to="/ip" className="btn btn-ghost">제주 IP 갤러리 보러 가기 →</Link></p>
          </>
        )}
      </div>
    </section>
  )
}
