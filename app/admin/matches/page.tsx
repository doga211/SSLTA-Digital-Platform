import { FederationModulePage } from "@/components/FederationModulePage";
import { MatchVerifier } from "@/components/MatchVerifier";
import { OfficialAssignment } from "@/components/OfficialAssignment";
import { createClient } from "@/lib/supabase/server";
export default async function Page(){
 const s=await createClient();
 const {data}=s?await s.from("matches").select("id,round_name,round_number,match_number,score_a,score_b,status,result_status,scheduled_at,court,player_a_id,player_b_id,winner_id").order("scheduled_at",{ascending:true}).limit(100):{data:[]};
 const {data:officialRows}=s?await s.from('profiles').select('id,full_name,role').in('role',['official','tournament_official','competition_manager','admin','super_admin']).order('full_name'): {data:[]};
 const officials=(officialRows??[]).map((o:any)=>({id:o.id,name:o.full_name??o.id.slice(0,8)}));
 return <FederationModulePage title="Match Operations" description="Courts, schedules, officials, live results, verification and progression.">
   <div className="workflow-strip"><b>Scheduled</b><span>→</span><b>On court</b><span>→</span><b>Submitted</b><span>→</span><b>Verified</b><span>→</span><b>Ranking eligible</b></div>
   <div className="table-wrap"><table><thead><tr><th>Round</th><th>Match</th><th>Players</th><th>Court / Time</th><th>Official</th><th>Score / Result</th></tr></thead><tbody>{(data??[]).map((m:any)=><tr key={m.id}><td>{m.round_name??`Round ${m.round_number??"—"}`}</td><td>{m.match_number??"—"}</td><td>{m.player_a_id?.slice(0,8)??"BYE"} vs {m.player_b_id?.slice(0,8)??"BYE"}</td><td>{m.court??"—"}<br/>{m.scheduled_at?new Date(m.scheduled_at).toLocaleString():"—"}</td><td><OfficialAssignment matchId={m.id} officials={officials}/></td><td>{m.result_status==="pending"&&m.player_a_id&&m.player_b_id?<MatchVerifier matchId={m.id}/>:`${m.score_a??"—"} ${m.score_b??""}`}</td></tr>)}</tbody></table>{!data?.length&&<div className="empty-state">No matches scheduled.</div>}</div>
 </FederationModulePage>
}
