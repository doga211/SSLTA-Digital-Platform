// type Props = {
//   email: string;
//   userId: string;
//   createdAt: string | null;
//   lastSignInAt: string | null;
//   metadata: Record<string, unknown>;
//   appMetadata: Record<string, unknown>;
//   avatarUrl?: string | null;
// };

// function display(value: unknown) {
//   if (value === null || value === undefined || value === "") return "—";
//   if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
//   return JSON.stringify(value);
// }

// export function AdminProfilePanel({ email, userId, createdAt, lastSignInAt, metadata, appMetadata }: Props) {
//   const name = metadata.full_name ?? metadata.name ?? metadata.display_name ?? "Administrator";
//   return (
//     <section className="admin-profile-panel">
//       <div className="admin-profile-header">  
//       <div className="admin-profile-avatar">
//         {typeof metadata.avatar_url === 'string' && metadata.avatar_url ? (
//           <img src={metadata.avatar_url} alt="Profile avatar" />
//         ) : (
//           <div className="admin-profile-avatar-placeholder">
//             {display(name).charAt(0).toUpperCase()}
//           </div>
//         )}
//       </div>
//       <div className="admin-profile-info">
//         <h2 className="admin-profile-name">{display(name)}</h2>
//         <p className="admin-profile-email">{email || "—"}</p>
//       </div>
//       </div>
//       <hr className="my-4" />
//       <h3 className="text-lg font-semibold">Account Details</h3>
//       <p className="text-sm text-slate-600 mb-4">
//         These details are read from the authenticated Supabase account.
//       </p>  
//       <div className="table-wrap">
//         <table>
//           <tbody>
//             <tr><th>Display name</th><td>{display(name)}</td></tr>
//             <tr><th>Email</th><td>{email || "—"}</td></tr>
//             <tr><th>Account ID</th><td><code>{userId}</code></td></tr>
//             <tr><th>Account created</th><td>{createdAt ? new Date(createdAt).toLocaleString() : "—"}</td></tr>
//             <tr><th>Last sign-in</th><td>{lastSignInAt ? new Date(lastSignInAt).toLocaleString() : "—"}</td></tr>
//             <tr><th>Application role metadata</th><td>{display(appMetadata.role ?? metadata.role)}</td></tr>
//           </tbody>
//         </table>
//       </div>
//       <p className="empty-state">
//         Profile details are read from the authenticated Supabase account. Editing identity or role information
//         should be connected to the SSLTA's approved profile and role-management policy before enabling changes.
//       </p>
//     </section>
//   );
// }





import { updateAdminAvatar } from "@/app/admin/actions";

type Props = {
  email: string;
  userId: string;
  createdAt: string | null;
  lastSignInAt: string | null;
  metadata: Record<string, unknown>;
  appMetadata: Record<string, unknown>;
  avatarUrl?: string | null;
};

function display(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return JSON.stringify(value);
}

export function AdminProfilePanel({
  email,
  userId,
  createdAt,
  lastSignInAt,
  metadata,
  appMetadata,
  avatarUrl,
}: Props) {
  const name =
    metadata.full_name ??
    metadata.name ??
    metadata.display_name ??
    "Administrator";

  const metadataAvatar =
    typeof metadata.avatar_url === "string"
      ? metadata.avatar_url
      : typeof metadata.picture === "string"
        ? metadata.picture
        : null;

  const photo = avatarUrl || metadataAvatar;

  return (
    <section className="admin-profile-panel">
      <div className="admin-profile-header">
        <div className="admin-profile-avatar">
          {photo ? (
            <img src={photo} alt={`${display(name)} profile`} />
          ) : (
            <div className="admin-profile-avatar-placeholder">
              {display(name).charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="admin-profile-info">
          <h2 className="admin-profile-name">{display(name)}</h2>
          <p className="admin-profile-email">{email || "—"}</p>
          <span className="profile-role">
            {display(appMetadata.role ?? metadata.role)}
          </span>
        </div>
      </div>

      <div className="admin-panel profile-photo-upload">
        <h3>Profile photograph</h3>
        <p>Upload a JPG, PNG or WebP image. Maximum size: 10 MB.</p>

        {/* <form
          action={updateAdminAvatar}
          className="admin-form"
          encType="multipart/form-data"
        >
          <input
            type="file"
            name="avatar"
            accept="image/jpeg,image/png,image/webp"
            required
          />

          <button type="submit" className="btn btn-primary">
            Update profile photo
          </button>
        </form> */}


        
<form
  action={updateAdminAvatar}
  className="admin-form"
>
  <label htmlFor="avatar">
    Profile photograph
  </label>

  <input
    id="avatar"
    type="file"
    name="avatar"
    accept="image/jpeg,image/png,image/webp"
    required
  />

  <button type="submit" className="btn btn-primary">
            Update profile photo
          </button>
</form>

      </div>

      <hr className="my-4" />

      <h3 className="text-lg font-semibold">Account Details</h3>

      <p className="text-sm text-slate-600 mb-4">
        These details are read from the authenticated Supabase account.
      </p>

      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>Display name</th>
              <td>{display(name)}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{email || "—"}</td>
            </tr>
            <tr>
              <th>Account ID</th>
              <td><code>{userId}</code></td>
            </tr>
            <tr>
              <th>Account created</th>
              <td>
                {createdAt
                  ? new Date(createdAt).toLocaleString()
                  : "—"}
              </td>
            </tr>
            <tr>
              <th>Last sign-in</th>
              <td>
                {lastSignInAt
                  ? new Date(lastSignInAt).toLocaleString()
                  : "—"}
              </td>
            </tr>
            <tr>
              <th>Application role metadata</th>
              <td>{display(appMetadata.role ?? metadata.role)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="empty-state">
        Profile identity and role information remain managed by the
        federation's approved account-management policy.
      </p>
    </section>
  );
}
