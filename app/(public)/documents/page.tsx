import Link from "next/link";
import { PageHero } from "@/components/PageHero";

const documents = [
  ["SSLTA Constitution", "Governance", "The association's constitutional framework and institutional mandate."],
  ["Competition Regulations", "Competition", "Rules and procedures for national competitions and sanctioned events."],
  ["National Ranking Regulations", "Rankings", "Framework for ranking seasons, points, publication and ranking governance."],
  ["Safeguarding & Athlete Welfare", "Integrity", "Policies supporting safe, respectful and inclusive participation."],
  ["Membership & Registration Forms", "Membership", "Official forms and information for players, clubs, coaches and officials."],
  ["Annual Reports & Notices", "Governance", "Official federation reports, circulars, notices and public information."],
] as const;

export default function DocumentsPage() {
  return <>
    <PageHero eyebrow="Official Information" title="Documents & Governance" text="A central public library for approved SSLTA governance, competition, ranking, safeguarding and membership information." />
    <section className="section"><div className="container">
      <div className="cards">
        {documents.map(([title, category, description]) => <article className="card" key={title}><div className="card-body"><span className="eyebrow" style={{color:"var(--blue)",marginBottom:7}}>{category}</span><h3>{title}</h3><p>{description}</p><Link className="details" href="/contact">REQUEST / VIEW →</Link></div></article>)}
      </div>
      <div className="admin-panel" style={{marginTop:30}}><h3>Document publication principle</h3><p style={{color:"var(--muted)",lineHeight:1.8}}>Only documents approved for public release should be published here. Internal board records, personal information and restricted operational documents should remain protected inside the federation management system.</p></div>
    </div></section>
  </>;
}
