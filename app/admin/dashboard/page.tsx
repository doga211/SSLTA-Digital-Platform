import { AdminShell } from "@/components/AdminShell";
import { Users, Trophy, Medal, Newspaper, Building2, ClipboardList, MessageSquare, Database } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { requireAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const [auth, data] = await Promise.all([requireAdmin(), getDashboardData()]);
  if (!auth.supabase || !auth.profile) redirect("/admin?error=unauthorized");
  const profile = auth.profile;
  const stats = [
    [Users,data.players,"Registered players"],[Building2,data.clubs,"Registered clubs"],[Trophy,data.tournaments,"Tournament records"],
    [Medal,data.rankingCategories,"Ranking categories"],[Newspaper,data.publishedNews,"Published news"],[ClipboardList,data.applications,"Pending membership applications"],[MessageSquare,data.enquiries,"New contact enquiries"]
  ] as const;
  return <AdminShell><main className="admin-main">
    <div className="admin-title"><div><h1>Federation Management Dashboard</h1><p>Live national tennis operations, competition, rankings and governance.</p></div><span className="status">{profile?.role ?? "Management"}</span></div>
    {!data.connected && <div className="notice">Supabase is not configured. Add the project URL and anon key to <code>.env.local</code> to activate live data.</div>}
    {data.connected && !data.schemaReady && <div className="form-error">Supabase is reachable, but one or more expected V2.5 tables or permissions are missing. Apply the V2.5 database migration and verify RLS grants before relying on these counts.</div>}
    <div className="admin-grid">{stats.map(([Icon,count,label])=><div className="admin-stat" key={label}><Icon/><strong>{data.schemaReady?count.toLocaleString():"—"}</strong><span>{label}</span></div>)}</div>
    <div className="admin-panel"><h3><Database size={18} style={{verticalAlign:"-4px",marginRight:7}}/>Backend connection</h3><div className="notice" style={{background:data.connected&&data.schemaReady?"#edf8f1":"#fff9dc",borderColor:data.connected&&data.schemaReady?"#198754":"var(--yellow)"}}>{data.connected&&data.schemaReady?"Supabase connection and expected V2.5 tables are available. Counts are queried using the signed-in user's permissions.":data.connected?"Supabase is reachable, but the expected V2.5 schema is incomplete.":"Backend connection is not configured. No sample figures are being presented as live records."}</div></div>
    <div className="admin-panel"><h3>Recent player registrations</h3><div className="table-wrap"><table className="table"><thead><tr><th>Player</th><th>Category</th><th>Status</th></tr></thead><tbody>{data.recentPlayers.length?data.recentPlayers.map((p:any)=><tr key={p.id}><td>{p.full_name}</td><td>{p.category}</td><td>{p.status}</td></tr>):<tr><td colSpan={3}>No player records available.</td></tr>}</tbody></table></div></div>
    <div className="admin-panel"><h3>Recent tournaments</h3><div className="table-wrap"><table className="table"><thead><tr><th>Tournament</th><th>Category</th><th>Status</th><th>Start date</th></tr></thead><tbody>{data.recentTournaments.length?data.recentTournaments.map((t:any)=><tr key={t.id}><td>{t.name}</td><td>{t.category}</td><td>{t.status}</td><td>{t.start_date||"Not scheduled"}</td></tr>):<tr><td colSpan={4}>No tournament records available.</td></tr>}</tbody></table></div></div>
    <div className="admin-panel"><h3>Recent content</h3><div className="table-wrap"><table className="table"><thead><tr><th>Headline</th><th>Status</th><th>Published</th></tr></thead><tbody>{data.recentNews.length?data.recentNews.map((n:any)=><tr key={n.id}><td>{n.title}</td><td>{n.status}</td><td>{n.published_at?new Date(n.published_at).toLocaleDateString():"—"}</td></tr>):<tr><td colSpan={3}>No news records available.</td></tr>}</tbody></table></div></div>
  </main></AdminShell>;
}
