import { PageHero } from "@/components/PageHero";

const getSupabaseClient = async () => {
  try {
    const mod = await import("@/lib/supabase/server");
    const factory =
      (mod as any).createClient ??
      (mod as any).createServerClient ??
      (mod as any).createServerComponentClient;

    return factory ? await factory() : null;
  } catch {
    return null;
  }
};

export default async function Page() {
  const s = await getSupabaseClient();
  const { data } = s
    ? await s
        .from("national_teams")
        .select("id,name,category,season,head_coach")
        .eq("status", "active")
    : { data: [] };

  return (
    <>
      <PageHero
        eyebrow="NATIONAL TEAMS"
        title="Representing South Sudan"
        text="National selection, player pathways and international competition preparation."
      />
      <main className="section">
        <div className="container">
          <div className="cards">
            {(data ?? []).map((t: any) => (
              <div className="standard-card" key={t.id}>
                <h3>{t.name}</h3>
                <p>
                  {t.category}
                  {t.season ? ` · ${t.season}` : ""}
                </p>
                <p>Head Coach: {t.head_coach ?? "To be announced"}</p>
              </div>
            ))}
          </div>
          {!data?.length && (
            <div className="empty-state">
              National team information will be published through the federation registry.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
