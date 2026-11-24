import { FederationModulePage } from "@/components/FederationModulePage";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
export default async function Page()
{


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
const {data}=supabase?await supabase.from("memberships").select("member_number,full_name,membership_type,status,valid_until")
.order("created_at",{ascending:false}).limit(50):{data:[]};
return <FederationModulePage title="Membership Registry" description="National member registration, status and eligibility administration.">
<div className="table-wrap"><table><thead><tr><th>Member</th><th>Name</th><th>Type</th><th>Status</th><th>Valid until</th></tr></thead>
<tbody>{(data??[]).map((m:any)=><tr key={m.member_number}><td>{m.member_number}</td><td>{m.full_name}</td><td>{m.membership_type}</td><td>{m.status}</td><td>{m.valid_until??"—"}</td></tr>)}</tbody></table>{!data?.length&&<div className="empty-state">No membership records yet.</div>}</div></FederationModulePage>}
