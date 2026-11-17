// import { FederationModulePage } from "@/components/FederationModulePage";
// import { createServerClient } from "@/lib/supabase/server";
// import { cookies } from "next/headers";

// export default async function Page() {
// 	const cookieStore = await cookies();
// 	const supabase = createServerClient(
// 		process.env.NEXT_PUBLIC_SUPABASE_URL!,
// 		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// 		{
// 			cookies: {
// 				get(name) {
// 					return cookieStore.get(name)?.value;
// 				},
// 				set(name, value, options) {
// 					cookieStore.set(name, value, options);
// 				},
// 				remove(name, options) {
// 					cookieStore.set(name, "", { ...options, maxAge: 0 });
// 				},
// 			},
// 		},
// 	);

// 	const { data } = await supabase
// 		.from("national_teams")
// 		.select("id,name,category,season,head_coach,status")
// 		.order("created_at", { ascending: false });

// 	return (
// 		<FederationModulePage
// 			title="National Teams"
// 			description="Squads, selections, coaches and international competition readiness."
// 		>
// 			<div className="cards">
// 				{(data ?? []).map((team: any) => (
// 					<div className="standard-card" key={team.id}>
// 						<h3>{team.name}</h3>
// 						<p>
// 							{team.category}
// 							{team.season ? ` · ${team.season}` : ""}
// 						</p>
// 						<p>Head coach: {team.head_coach ?? "Not assigned"}</p>
// 						<p>Status: {team.status}</p>
// 					</div>
// 				))}
// 			</div>
// 			{!data?.length && (
// 				<div className="empty-state">No national team squads registered yet.</div>
// 			)}
// 		</FederationModulePage>
// 	);
// }

























import { FederationModulePage } from "@/components/FederationModulePage";
import { createServerClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createServerClient();

  const { data } = await supabase
    .from("national_teams")
    .select("id,name,category,season,head_coach,status")
    .order("created_at", { ascending: false });

  return (
    <FederationModulePage
      title="National Teams"
      description="Squads, selections, coaches and international competition readiness."
    >
      <div className="cards">
        {(data ?? []).map((team: any) => (
          <div className="standard-card" key={team.id}>
            <h3>{team.name}</h3>
            <p>
              {team.category}
              {team.season ? ` · ${team.season}` : ""}
            </p>
            <p>Head coach: {team.head_coach ?? "Not assigned"}</p>
            <p>Status: {team.status}</p>
          </div>
        ))}
      </div>

      {!data?.length && (
        <div className="empty-state">
          No national team squads registered yet.
        </div>
      )}
    </FederationModulePage>
  );
}
