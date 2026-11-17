// import { FederationModulePage } from "@/components/FederationModulePage";
// import { createServerClient } from "@supabase/ssr";


  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_PUBLISHABLE_KEY!,
  //   {
  //     cookies: {
  //       get: async () => "",
  //     },
  //   }
  // );

import { FederationModulePage } from "@/components/FederationModulePage";
import { createServerClient } from "@/lib/supabase/server";

export default async function Page() {
const supabase = await createServerClient();

  const { data } = await supabase
    .from("development_programs")
    .select("id,name,programme_type,venue,start_date,end_date,status")
    .order("start_date", { ascending: true });

  return (
    <FederationModulePage
      title="Development Programmes"
      description="Grassroots, junior, women, coaching and officiating development."
    >
      <div className="cards">
        {(data ?? []).map((p: any) => (
          <div className="standard-card" key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.programme_type}</p>
            <p>
              {p.venue ?? "Venue TBC"} · {p.start_date ?? "Date TBC"}
            </p>
            <span className="status">{p.status}</span>
          </div>
        ))}
      </div>
      {!data?.length && (
        <div className="empty-state">No development programmes registered.</div>
      )}
    </FederationModulePage>
  );
}
