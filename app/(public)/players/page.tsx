// import { PageHero } from "@/components/PageHero"; 
// import { createServerSupabase } from "@/lib/supabase-server";
// export const dynamic="force-dynamic";
// export default async function Players(){const db=await createServerSupabase();const {data,error}=db?await db.from("players").select("id,full_name,category,ranking_position,status").eq("status","active").order("category").order("ranking_position",{ascending:true,nullsFirst:false}):{data:[],error:null};return <><PageHero eyebrow="Players" title="South Sudan tennis players" text="A national player directory connects athletes with rankings, results, tournament entries and development pathways."/><section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow" style={{color:"var(--blue)"}}>Player directory</span><h2>Registered competition categories</h2></div></div>{error?<p className="form-error">Player directory could not be loaded.</p>:<div className="table-wrap"><table className="table"><thead><tr><th>#</th><th>Player</th><th>Category</th><th>Ranking</th></tr></thead><tbody>{data?.length?data.map((p:any,i:number)=><tr key={p.id}><td>{i+1}</td><td><b>{p.full_name}</b></td><td>{p.category}</td><td>{p.ranking_position??"Not ranked"}</td></tr>):<tr><td colSpan={4}>No public player records are available yet.</td></tr>}</tbody></table></div>}</div></section></>}




import { PageHero } from "@/components/PageHero";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type Player = {
  id: string;
  full_name: string;
  category: string;
  ranking_position: number | null;
  status: string;
  photo_url: string | null;
};

export default async function Players() {
  const db = await createServerSupabase();

  const { data, error } = db
    ? await db
        .from("players")
        .select(
          "id,full_name,category,ranking_position,status,photo_url"
        )
        .eq("status", "active")
        .order("category")
        .order("ranking_position", {
          ascending: true,
          nullsFirst: false,
        })
        .order("full_name")
    : { data: [], error: null };

  const players = (data ?? []) as Player[];

  return (
    <>
      <PageHero
        eyebrow="Players"
        title="South Sudan tennis players"
        text="A national player directory connecting athletes with rankings, results, tournament entries and development pathways."
      />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span
                className="eyebrow"
                style={{ color: "var(--blue)" }}
              >
                Player directory
              </span>
              <h2>Registered competition players</h2>
            </div>
          </div>

          {!db && (
            <p className="form-error">
              Player directory is temporarily unavailable.
            </p>
          )}

          {error && (
            <p className="form-error">
              Player directory could not be loaded.
            </p>
          )}

          {!error && db && players.length > 0 && (
            <div className="player-directory">
              {players.map((player, index) => (
                <article
                  className="player-profile-card"
                  key={player.id}
                >
                  <div className="player-profile-photo">
                    {player.photo_url ? (
                      <img
                        src={player.photo_url}
                        alt={`${player.full_name} profile`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="player-photo-placeholder">
                        {player.full_name
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="player-profile-info">
                    <span className="player-number">
                      Player #{index + 1}
                    </span>

                    <h3>{player.full_name}</h3>

                    <p>{player.category}</p>

                    <span className="player-ranking">
                      {player.ranking_position
                        ? `National ranking: ${player.ranking_position}`
                        : "Not yet ranked"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!error && db && players.length === 0 && (
            <p className="empty-state">
              No public player records are available yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
    