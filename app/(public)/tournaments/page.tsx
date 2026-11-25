// import { PageHero } from "@/components/PageHero"; import { createServerSupabase } from "@/lib/supabase-server";
// export const dynamic="force-dynamic";
// export default async function Tournaments(){const db=await createServerSupabase();const {data,error}=db?await db.from("tournaments").select("id,name,category,status,start_date,end_date,venue,description").neq("status","draft").order("start_date",{ascending:true}):{data:[],error:null};return <><PageHero eyebrow="Competition" title="Tournaments & events" text="A central calendar for national championships, junior development events and community tennis programmes."/><section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow" style={{color:"var(--blue)"}}>Competition calendar</span><h2>National events</h2></div></div>{error?<p className="form-error">Tournament calendar could not be loaded.</p>:<div className="table-wrap"><table className="table"><thead><tr><th>Event</th><th>Category</th><th>Status</th><th>Date</th><th>Venue</th></tr></thead><tbody>{data?.length?data.map((t:any)=><tr key={t.id}><td><b>{t.name}</b>{t.description&&<small className="table-sub">{t.description}</small>}</td><td>{t.category}</td><td><span className="status">{t.status}</span></td><td>{t.start_date||"To be announced"}</td><td>{t.venue||"To be announced"}</td></tr>):<tr><td colSpan={5}>No public tournament events have been published yet.</td></tr>}</tbody></table></div>}<div className="feature-list"><div className="feature"><b>Competition governance</b><span>Competition records are maintained by authorized SSLTA administrators. Publication and result verification workflows remain subject to federation approval.</span></div></div></div></section></>}




import { PageHero } from "@/components/PageHero";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type Tournament = {
  id: string;
  name: string;
  category: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  venue: string | null;
  description: string | null;
};

function formatDate(date: string | null) {
  if (!date) return "To be announced";

  const parsed = new Date(`${date.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "To be announced";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(
  start: string | null,
  end: string | null
) {
  if (!start && !end) return "To be announced";
  if (start && !end) return formatDate(start);
  if (!start && end) return formatDate(end);

  if (start === end) return formatDate(start);

  return `${formatDate(start)} – ${formatDate(end)}`;
}

export default async function Tournaments() {
  const db = await createServerSupabase();

  const { data, error } = db
    ? await db
        .from("tournaments")
        .select(
          "id,name,category,status,start_date,end_date,venue,description"
        )
        .neq("status", "draft")
        .order("start_date", {
          ascending: true,
          nullsFirst: false,
        })
    : { data: [], error: null };

  const tournaments = (data ?? []) as Tournament[];

  return (
    <>
      <PageHero
        eyebrow="Competition"
        title="Tournaments & events"
        text="A central calendar for national championships, junior development events and community tennis programmes."
      />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span
                className="eyebrow"
                style={{ color: "var(--blue)" }}
              >
                Competition calendar
              </span>
              <h2>National events</h2>
            </div>
          </div>

          {!db && (
            <p className="form-error">
              Tournament calendar is temporarily unavailable.
            </p>
          )}

          {error && (
            <p className="form-error">
              Tournament calendar could not be loaded.
            </p>
          )}

          {!error && db && (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Venue</th>
                  </tr>
                </thead>

                <tbody>
                  {tournaments.length > 0 ? (
                    tournaments.map((tournament) => (
                      <tr key={tournament.id}>
                        <td>
                          <b>{tournament.name}</b>

                          {tournament.description && (
                            <small className="table-sub">
                              {tournament.description}
                            </small>
                          )}
                        </td>

                        <td>{tournament.category}</td>

                        <td>
                          <span className="status">
                            {tournament.status.replace(/_/g, " ")}
                          </span>
                        </td>

                        <td>
                          {formatDateRange(
                            tournament.start_date,
                            tournament.end_date
                          )}
                        </td>

                        <td>
                          {tournament.venue || "To be announced"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        No public tournament events have been published yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="feature-list">
            <div className="feature">
              <b>Competition governance</b>
              <span>
                Competition records are maintained by authorized
                SSLTA administrators. Publication and result
                verification workflows remain subject to federation
                approval.
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
