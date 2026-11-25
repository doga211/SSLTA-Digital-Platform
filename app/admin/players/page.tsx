import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/supabase-server";
import { createPlayer, deleteRecord } from "@/app/admin/actions";
import { redirect } from "next/navigation";
export const dynamic="force-dynamic";
export default async function AdminPlayers({searchParams}:{searchParams:Promise<{saved?:string;error?:string;deleted?:string}>}) {
  const [{supabase,profile},params]=await Promise.all([requireAdmin(),searchParams]); if(!supabase||!profile) redirect("/admin?error=unauthorized");
  const {data:players,error}=await supabase.from("players").select("id,full_name,category,gender,status,nationality,ranking_position").order("full_name");
  return <AdminShell><main className="admin-main"><div className="admin-title"><div><h1>Player Registry</h1><p>Live player records from the federation database.</p></div></div>
    {params.saved&&<p className="form-success">Player record saved.</p>}{params.error&&<p className="form-error">Unable to save the record. Check required fields and database permissions.</p>}
    <div className="admin-panel"><h3>Register a player</h3><form action={createPlayer} className="admin-form"><input name="full_name" placeholder="Player full name" required/><select name="category" required defaultValue=""><option value="" disabled>Select category</option>{["Men's Singles","Women's Singles","Boys U18","Girls U18","Boys U16","Girls U16","Mini Tennis","Other"].map(x=><option key={x}>{x}</option>)}</select><select name="gender" defaultValue=""><option value="">Gender (optional)</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select><input name="nationality" defaultValue="South Sudan" placeholder="Nationality"/><button className="btn btn-primary">Save player</button></form></div>
    <div className="admin-panel"><h3>Registered players ({players?.length??0})</h3>{error?<p className="form-error">Could not load player records: {error.message}</p>:<div className="table-wrap"><table className="table"><thead><tr><th>Player</th><th>Category</th><th>Gender</th><th>Ranking</th><th>Status</th><th>Action</th></tr></thead><tbody>{players?.length?players.map(p=><tr key={p.id}><td><b>{p.full_name}</b></td><td>{p.category}</td><td>{p.gender||"—"}</td><td>{p.ranking_position??"—"}</td><td>{p.status}</td><td><form action={deleteRecord}><input type="hidden" name="table" value="players"/><input type="hidden" name="id" value={p.id}/><button className="btn btn-danger" formAction={deleteRecord}>Delete</button></form></td></tr>):<tr><td colSpan={6}>No players have been registered yet.</td></tr>}</tbody></table></div>}</div>
  </main></AdminShell>;
}
