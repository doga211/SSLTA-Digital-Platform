import { FederationModulePage } from '@/components/FederationModulePage'
import { ScheduleControl } from '@/components/ScheduleControl'
import { createServerClient } from '@/lib/supabase/server'
export default async function Page(){

//  const s = createServerClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//   {
//    cookies: {} as any,
//   },
//  );

const supabase = await createServerClient()



 const {data:courts}=supabase?await supabase.from('courts').select('id,name').eq('active',true).order('name'):{data:[]}
 const {data:matches}=supabase?await supabase.from('matches').select('id,round_name,round_number,match_number,player_a_id,player_b_id,scheduled_at,court,live_status').in('live_status',['scheduled','called','delayed']).order('scheduled_at',{ascending:true}).limit(100):{data:[]}
 return <FederationModulePage title="Court & Schedule Control" description="Assign courts and time windows with conflict detection before matches reach the live board.">
  <div className="workflow-strip"><b>Available courts</b><span>→</span><b>Conflict check</b><span>→</span><b>Scheduled</b><span>→</span><b>Called</b><span>→</span><b>On court</b></div>
  <div className="table-wrap"><table><thead><tr><th>Match</th><th>Players</th><th>Current slot</th><th>Assign</th></tr></thead><tbody>{(matches??[]).map((m:any)=><tr key={m.id}><td>{m.round_name??`Round ${m.round_number}`} #{m.match_number??'—'}</td><td>{m.player_a_id?.slice(0,8)??'BYE'} vs {m.player_b_id?.slice(0,8)??'BYE'}</td><td>{m.court??'Unassigned'}<br/>{m.scheduled_at?new Date(m.scheduled_at).toLocaleString():'—'}</td><td><ScheduleControl matchId={m.id} courts={(courts??[]) as any}/></td></tr>)}</tbody></table></div>
 </FederationModulePage>
}
