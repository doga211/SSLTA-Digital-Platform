import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { FederationModulePage } from "@/components/FederationModulePage";
import { EnquiriesOverview } from "@/components/EnquiriesOverview";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return (
      <FederationModulePage title="New Enquiries & Forms" description="Website submissions and membership enquiries.">
        <p className="empty-state">Supabase configuration is incomplete.</p>
      </FederationModulePage>
    );
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try {
          items.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot always write cookies during rendering.
        }
      },
    },
  });

  // RLS must restrict these records to authorised administrators.
  // Select existing rows without assuming column names that may differ by deployment.
  const [contacts, memberships] = await Promise.all([
    supabase.from("contact_enquiries").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("membership_applications").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  return (
    <FederationModulePage
      title="New Enquiries & Forms"
      description="Review website contact enquiries and membership applications."
    >
      <EnquiriesOverview
        contacts={contacts.data ?? []}
        memberships={memberships.data ?? []}
        contactError={contacts.error?.message ?? null}
        membershipError={memberships.error?.message ?? null}
      />
    </FederationModulePage>
  );
}
