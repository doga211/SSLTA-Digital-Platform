import { PageHero } from "@/components/PageHero";
import { createClient } from "@supabase/supabase-js";

export default async function Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data } = await supabase
    .from("clubs")
    .select("name,location,court_count,verified")
    .order("name");

  return (
    <>
      <PageHero
        eyebrow="FEDERATION NETWORK"
        title="Clubs & Tennis Centres"
        text="The national network supporting participation, competition and player development."
      />
      <main className="section">
        <div className="container">
          <div className="cards">
            {(data ?? []).map((c: any) => (
              <div className="standard-card" key={c.name}>
                <h3>{c.name}</h3>
                <p>{c.location ?? "South Sudan"}</p>
                <p>
                  {c.court_count ?? 0} courts · {c.verified ? "Verified centre" : "Registry record"}
                </p>
              </div>
            ))}
          </div>
          {!data?.length && (
            <div className="empty-state">
              Club registry information will appear as centres are onboarded.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
