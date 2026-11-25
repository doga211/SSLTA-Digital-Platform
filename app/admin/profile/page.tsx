import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { FederationModulePage } from "@/components/FederationModulePage";
import { AdminProfilePanel } from "@/components/AdminProfilePanel";

export const dynamic = "force-dynamic";


export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  // Keep your existing Supabase authentication logic.


  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


    

  if (!url || !key) {
    return (
      <FederationModulePage title="Admin Profile" description="Administrator account details.">
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

  const { data: { user }, error } = await supabase.auth.getUser();


//   const metadata = user?.user_metadata ?? {};

  

// const avatarUrl =
//   typeof metadata.avatar_url === "string"
//     ? metadata.avatar_url
//     : typeof metadata.picture === "string"
//       ? metadata.picture
//       : null;




const metadata = user?.user_metadata ?? {};

const avatarUrl =
  typeof metadata.avatar_url === "string"
    ? metadata.avatar_url
    : typeof metadata.picture === "string"
      ? metadata.picture
      : null;

return (
    <FederationModulePage
      title="Admin Profile"
      description="View your authenticated administrator account and profile metadata."
    >
      {error || !user ? (
        <div className="empty-state">
          Unable to load your authenticated profile. Please sign in again.
        </div>
      ) : (
        // <AdminProfilePanel
        //   email={user.email ?? ""}
        //   userId={user.id}
        //   createdAt={user.created_at ?? null}
        //   lastSignInAt={user.last_sign_in_at ?? null}
        //   metadata={user.user_metadata ?? {}}
        //   appMetadata={user.app_metadata ?? {}}
        // />



//         <AdminProfilePanel
//   email={user.email ?? ""}
//   userId={user.id}
//   createdAt={user.created_at ?? null}
//   lastSignInAt={user.last_sign_in_at ?? null}
//   metadata={metadata}
//   appMetadata={user.app_metadata ?? {}}
//   avatarUrl={avatarUrl}
// />
     
     
     <AdminProfilePanel
  email={user.email ?? ""}
  userId={user.id}
  createdAt={user.created_at ?? null}
  lastSignInAt={user.last_sign_in_at ?? null}
  metadata={metadata}
  appMetadata={user.app_metadata ?? {}}
  avatarUrl={avatarUrl}
/>
     
     )}
    </FederationModulePage>
  );
}


