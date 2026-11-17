import { FederationModulePage } from "@/components/FederationModulePage";
import { DrawGenerator } from "@/components/DrawGenerator";
import { createClient } from "@/lib/supabase/server";

export default async function Page(){
  const s=await createClient();
  const {data: categories}=s?await s.from("tournament_categories").select("id,name").order("name"): {data:[]};
  const {data: draws}=s?await s.from("draws").select("id,draw_type,draw_size,status,tournament_categories(name,tournaments(name))").order("created_at",{ascending:false}).limit(50):{data:[]};
  return <FederationModulePage title="Draw Management" description="Prepare, publish and lock competition draws with deterministic seeding and BYE handling.">
    <DrawGenerator categories={(categories??[]) as any}/>
    <div className="workflow-strip"><b>Verified entries</b><span>→</span><b>Seed</b><span>→</span><b>Generate</b><span>→</span><b>Publish</b><span>→</span><b>Lock</b></div>
    <div className="table-wrap"><table><thead><tr><th>Competition</th><th>Format</th><th>Size</th><th>Status</th></tr></thead><tbody>{(draws??[]).map((d:any)=><tr key={d.id}><td>{d.tournament_categories?.tournaments?.name??d.tournament_categories?.name??"—"}</td><td>{d.draw_type}</td><td>{d.draw_size??"—"}</td><td>{d.status}</td></tr>)}</tbody></table>{!draws?.length&&<div className="empty-state">No draws generated yet.</div>}</div>
  </FederationModulePage>
}
