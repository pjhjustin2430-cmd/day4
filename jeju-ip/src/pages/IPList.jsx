import { IPS } from '../data/ips'
import IPCard from '../components/IPCard.jsx'

export default function IPList() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">IP 갤러리</h1>
        <p className="section-sub">카드를 눌러 설명과 이미지를 구경해 보세요.</p>
        <div className="ip-grid">
          {IPS.map((ip) => <IPCard key={ip.slug} ip={ip} />)}
        </div>
      </div>
    </section>
  )
}
