import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { FederationModulePage } from "@/components/FederationModulePage";
import { SecurityOverview } from "@/components/SecurityOverview";

export const dynamic = "force-dynamic";

export default async function AdminSecurityPage() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return (
      <FederationModulePage title="Security & Access Control" description="Administrator access and audit activity.">
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

  const [{ data: { user } }, audit] = await Promise.all([
    supabase.auth.getUser().then((result) => ({ data: result.data, error: result.error })),
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50),
  ]);

  return (
    <FederationModulePage
      title="Security & Access Control"
      description="Review the signed-in account and recent recorded security activity."
    >
      <SecurityOverview
        user={user ? {
          id: user.id,
          email: user.email ?? "",
          role: String(user.app_metadata?.role ?? user.user_metadata?.role ?? "Not exposed"),
          lastSignInAt: user.last_sign_in_at ?? null,
        } : null}
        auditRows={audit.data ?? []}
        auditError={audit.error?.message ?? null}
      />
    </FederationModulePage>
  );
}
