import { AdminShell } from "@/components/AdminShell";
import { historicalEvents, annualProgrammeProposal } from "@/lib/heritage";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ContentComposer } from "@/components/ContentComposer";
import { ContentStatusAction } from "@/components/ContentStatusAction";

export default async function AdminEvents() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Ignore cookie write failures in server components.
          }
        }
      }
    }
  );

  const { data } = await supabase
    .from("events")
    .select("id,title,date_label,venue,category,status,is_public,source_document")
    .order("starts_on", { ascending: false })
    .limit(150);

  const rows = data?.length
    ? data
    : historicalEvents.map((e) => ({
        id: e.id,
        title: e.title,
        date_label: e.date,
        venue: e.venue,
        category: e.category,
        status: e.status,
        is_public: e.status !== "Proposed – approval required",
        source_document: e.source
      }));

  return <AdminShell><main className="admin-main"><div className="admin-title"><div><h1>Events & Heritage Calendar</h1><p>Review documented history and the proposed annual programme before publication.</p></div></div><div className="admin-panel"><h2>Events register</h2><div className="table-wrap"><table className="table"><thead><tr><th>Event</th><th>Date</th><th>Venue</th><th>Category</th><th>Status</th><th>Visibility / action</th></tr></thead><tbody>{rows.map((e:any)=><tr key={e.id}><td><b>{e.title}</b></td><td>{e.date_label??'Date TBC'}</td><td>{e.venue??'To be confirmed'}</td><td>{e.category??'—'}</td><td>{e.status}</td><td><div>{e.is_public?'Public':'Private / draft'}<ContentStatusAction kind="event" id={e.id} status={e.status} sourceDocument={e.source_document}/></div></td></tr>)}</tbody></table></div></div><div className="admin-panel" style={{marginTop:20}}><ContentComposer kind="event"/></div><div className="admin-panel" style={{marginTop:20}}><h2>Annual programme proposal</h2><p>These activities are planning proposals. Confirm Board/committee approval, event dates, venues, budget and tournament sanctioning before changing status to approved or published.</p><div className="table-wrap"><table className="table"><thead><tr><th>Period</th><th>Activity</th><th>Focus</th><th>Current status</th></tr></thead><tbody>{annualProgrammeProposal.map(r=><tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}</tbody></table></div></div></main></AdminShell>;
}
