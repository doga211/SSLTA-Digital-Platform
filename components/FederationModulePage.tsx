// import Link from "next/link";
// import { requireAdmin } from "@/lib/auth/require-admin";
// export async function FederationModulePage({title,description,children}
//     :{title:string;description:string;children:React.ReactNode}){const p=await requireAdmin();
        
//     return <main className="admin-main"><div className="admin-title"><div><div className="eyebrow">SSLTA FEDERATION MANAGEMENT</div>
//     <h1>{title}</h1>
//     <p>{description}</p>
//     </div>
    
//     <div className="status">{String(p.role).replaceAll("_"," ")}</div></div>
//     <div className="admin-panel"><div className="module-actions"><Link href="/admin/dashboard">← Dashboard</Link></div>{children}</div></main>}







import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";

type FederationModulePageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  searchParams?: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export async function FederationModulePage({
  title,
  description,
  children,
  searchParams,
}: FederationModulePageProps) {
  const p = await requireAdmin();
  const params = searchParams ? await searchParams : {};

  return (
    <main className="admin-main">
      <div className="admin-title">
        <div>
          <div className="eyebrow">
            SSLTA FEDERATION MANAGEMENT
          </div>

          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="status">
          {String(p.role).replaceAll("_", " ")}
        </div>
      </div>

      {params.saved === "avatar" && (
        <p className="form-success">
          Profile photograph updated.
        </p>
      )}

      {params.error && (
        <p className="form-error">
          Unable to update the profile photograph.
          Check the file and Storage permissions.
        </p>
      )}

      <div className="admin-panel">
        <div className="module-actions">
          <Link href="/admin/dashboard">
            ← Dashboard
          </Link>
        </div>

        {children}
      </div>
    </main>
  );
}
