// import { FederationModulePage } from '@/components/FederationModulePage'
// import { MatchLiveControl } from '@/components/MatchLiveControl'
// import * as SupabaseServer from '@/lib/supabase/server'

// export default async function Page() {
//   const supabase =
//     typeof SupabaseServer.createServerClient === 'function'
//       ? SupabaseServer.createServerClient(
//           process.env.NEXT_PUBLIC_SUPABASE_URL!,
//           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//           {
//             cookies: {} as any,
//           }
//         )
//       : typeof (SupabaseServer as any).createClient === 'function'
//         ? await (SupabaseServer as any).createClient()
//         : null

//   const { data } = supabase
//     ? await supabase
//         .from('matches')
//         .select(
//           'id,round_name,round_number,match_number,player_a_id,player_b_id,score_a,score_b,winner_id,live_status,result_status,court,scheduled_at'
//         )
//         .in('live_status', ['called', 'on_court', 'paused', 'delayed'])
//         .order('scheduled_at', { ascending: true })
//         .limit(100)
//     : { data: [] }

//   return (
//     <FederationModulePage
//       title="Live Tournament Control"
//       description="Control match state for officials and the public live results board."
//     >
//       <div className="workflow-strip">
//         <b>Called</b>
//         <span>→</span>
//         <b>On court</b>
//         <span>→</span>
//         <b>Score submitted</b>
//         <span>→</span>
//         <b>Verified</b>
//       </div>
//       <div className="table-wrap">
//         <table>
//           <thead>
//             <tr>
//               <th>Match</th>
//               <th>Players</th>
//               <th>Court</th>
//               <th>Score</th>
//               <th>Live state</th>
//             </tr>
//           </thead>
//           <tbody>
//             {(data ?? []).map((m: any) => (
//               <tr key={m.id}>
//                 <td>
//                   {m.round_name ?? `Round ${m.round_number}`} #{m.match_number ?? '—'}
//                 </td>
//                 <td>
//                   {m.player_a_id?.slice(0, 8) ?? 'BYE'} vs {m.player_b_id?.slice(0, 8) ?? 'BYE'}
//                 </td>
//                 <td>{m.court ?? '—'}</td>
//                 <td>
//                   {m.score_a ?? '—'} {m.score_b ?? ''}
//                 </td>
//                 <td>
//                   <MatchLiveControl matchId={m.id} current={m.live_status ?? 'scheduled'} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {!data?.length && <div className="empty-state">No live matches are currently active.</div>}
//       </div>
//     </FederationModulePage>
//   )
// }




















// import { FederationModulePage } from "@/components/FederationModulePage";
// import { MatchLiveControl } from "@/components/MatchLiveControl";
// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export default async function Page() {
//   const cookieStore = await cookies();
//   const s = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll: () => cookieStore.getAll(),
//         setAll: (cookiesToSet) => {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
//           } catch {
//             // Cookies cannot be written while rendering a Server Component.
//           }
//         },
//       },
//     },
//   );  
//   const { data, error } = await s
//     .from("matches")
//     .select(
//       "id,round_name,round_number,match_number,player_a_id,player_b_id,score_a,score_b,winner_id,live_status,result_status,court,scheduled_at"
//     )
//     .in("live_status", ["called", "on_court", "paused", "delayed"])
//     .order("scheduled_at", { ascending: true })
//     .limit(100);

//   if (error) {
//     console.error("Unable to load live matches:", error.message);
//   }

//   return (
//     <FederationModulePage
//       title="Live Tournament Control"
//       description="Control match state for officials and the public live results board."
//     >
//       <div className="workflow-strip">
//         <b>Called</b>
//         <span>→</span>
//         <b>On court</b>
//         <span>→</span>
//         <b>Score submitted</b>
//         <span>→</span>
//         <b>Verified</b>
//       </div>

//       <div className="table-wrap">
//         <table>
//           <thead>
//             <tr>
//               <th>Match</th>
//               <th>Players</th>
//               <th>Court</th>
//               <th>Score</th>
//               <th>Live state</th>
//             </tr>
//           </thead>

//           <tbody>
//             {(data ?? []).map((m: any) => (
//               <tr key={m.id}>
//                 <td>
//                   {m.round_name ?? `Round ${m.round_number}`} #
//                   {m.match_number ?? "—"}
//                 </td>

//                 <td>
//                   {m.player_a_id?.slice(0, 8) ?? "BYE"} vs{" "}
//                   {m.player_b_id?.slice(0, 8) ?? "BYE"}
//                 </td>

//                 <td>{m.court ?? "—"}</td>

//                 <td>
//                   {m.score_a ?? "—"} {m.score_b ?? ""}
//                 </td>

//                 <td>
//                   <MatchLiveControl
//                     matchId={m.id}
//                     current={m.live_status ?? "scheduled"}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {!data?.length && (
//           <div className="empty-state">
//             No live matches are currently active.
//           </div>
//         )}
//       </div>
//     </FederationModulePage>
//   );
// }






import { FederationModulePage } from "@/components/FederationModulePage";
import { MatchLiveControl } from "@/components/MatchLiveControl";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase server configuration is incomplete.");
  }

  const s = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Cookies cannot be written while rendering a Server Component.
        }
      },
    },
  });

  const { data, error } = await s
    .from("matches")
    .select(
      "id,round_name,round_number,match_number,player_a_id,player_b_id,score_a,score_b,winner_id,status,verification_status,court,scheduled_at"
    )
    .order("scheduled_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Unable to load live matches:", error.message);
  }

  return (
    <FederationModulePage
      title="Live Tournament Control"
      description="Control match state for officials and the public live results board."
    >
      <div className="workflow-strip">
        <b>Scheduled</b>
        <span>→</span>
        <b>In progress</b>
        <span>→</span>
        <b>Completed</b>
        <span>→</span>
        <b>Verified</b>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Match</th>
              <th>Players</th>
              <th>Court</th>
              <th>Score</th>
              <th>Match status</th>
              <th>Result verification</th>
              <th>Live control</th>
            </tr>
          </thead>

          <tbody>
            {(data ?? []).map((m) => (
              <tr key={m.id}>
                <td>
                  {m.round_name ?? `Round ${m.round_number ?? "—"}`} #
                  {m.match_number ?? "—"}
                </td>

                <td>
                  {m.player_a_id?.slice(0, 8) ?? "BYE"} vs{" "}
                  {m.player_b_id?.slice(0, 8) ?? "BYE"}
                </td>

                <td>{m.court ?? "—"}</td>

                <td>
                  {m.score_a ?? "—"} {m.score_b ?? ""}
                </td>

                <td>{m.status ?? "—"}</td>

                <td>{m.verification_status ?? "—"}</td>

                <td>
                  <MatchLiveControl
                    matchId={m.id}
                    current={m.status ?? "scheduled"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!error && !data?.length && (
          <div className="empty-state">
            No matches are currently available.
          </div>
        )}

        {error && (
          <div className="empty-state">
            Unable to load matches. Please check the server logs.
          </div>
        )}
      </div>
    </FederationModulePage>
  );
}
