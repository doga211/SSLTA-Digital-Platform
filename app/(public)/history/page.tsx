import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { historicalEvents, juniorResults } from "@/lib/heritage";

export default function HistoryPage(){
  return <><PageHero eyebrow="SSLTA DIGITAL HERITAGE" title="Our History & Milestones" text="A growing institutional archive of South Sudan tennis, grounded in SSLTA’s Annual Report 2023/2024."/>
    <main className="section"><div className="container">
      <div className="standard-card" style={{marginBottom:24}}><span className="tag">Our beginning</span><h2>From the first steps to a national tennis pathway</h2><p>SSLTA identifies 8 June 2023 as its inception date. Its 2023/2024 report documents early work in coach education, school tennis, junior development, competition and institutional registration.</p><p><b>Archive note:</b> Entries on this page reflect the 2023/2024 report. Proposed activities are not presented as completed events.</p></div>
      <div className="standards">{historicalEvents.map((e)=><article className="standard-card" key={e.id}><span className="tag">{e.category}</span><h3>{e.title}</h3><p><b>{e.date}</b> · {e.venue}</p><p>{e.summary}</p><small>{e.source} · {e.status}</small></article>)}</div>
      <section style={{marginTop:42}}><div className="section-head"><div><span className="eyebrow">Competition archive</span><h2>First Inter-Schools and Juniors Tournament – Results</h2><p>8–10 March 2024 · Acacia Village Tennis Court and Jubek Model Secondary School</p></div><Link className="view" href="/events">Events calendar →</Link></div>
        <div className="table-wrap"><table><thead><tr><th>Category</th><th>Winner</th><th>Runner-up</th></tr></thead><tbody>{juniorResults.map(r=><tr key={r[0]}><td>{r[0]}</td><td><b>{r[1]}</b></td><td>{r[2]}</td></tr>)}</tbody></table></div>
        <p className="muted" style={{marginTop:12}}>Names are transcribed from the Annual Report. Verify spellings against official result sheets before final publication.</p>
      </section>
    </div></main></>;
}
