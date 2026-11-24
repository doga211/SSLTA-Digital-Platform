type AuditRow = Record<string, unknown>;
type UserSummary = { id: string; email: string; role: string; lastSignInAt: string | null } | null;

function value(v: unknown) {
  if (v === null || v === undefined || v === "") return "—";
  return typeof v === "object" ? JSON.stringify(v) : String(v);
}

export function SecurityOverview({ user, auditRows, auditError }: {
  user: UserSummary;
  auditRows: AuditRow[];
  auditError: string | null;
}) {
  const columns = Array.from(new Set(auditRows.flatMap((row) => Object.keys(row)))).slice(0, 7);
  return (
    <div className="security-overview">
      <section>
        <h2>Current authenticated account</h2>
        {user ? (
          <div className="table-wrap">
            <table><tbody>
              <tr><th>Email</th><td>{user.email || "—"}</td></tr>
              <tr><th>User ID</th><td><code>{user.id}</code></td></tr>
              <tr><th>Role metadata</th><td>{user.role}</td></tr>
              <tr><th>Last sign-in</th><td>{user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "—"}</td></tr>
            </tbody></table>
          </div>
        ) : <p className="empty-state">No authenticated user was returned.</p>}
      </section>
      <section>
        <h2>Recent audit activity</h2>
        {auditError ? (
          <p className="empty-state">Audit log unavailable: {auditError}. Check the existing audit_logs schema and administrator RLS policy.</p>
        ) : auditRows.length === 0 ? (
          <p className="empty-state">No audit events are available.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>{columns.map((column) => <th key={column}>{column.replaceAll("_", " ")}</th>)}</tr></thead>
              <tbody>{auditRows.map((row, i) => (
                <tr key={value(row.id) !== "—" ? value(row.id) : i}>
                  {columns.map((column) => <td key={column}>{value(row[column])}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
      <p className="empty-state">
        This module is intentionally read-only. Do not grant or revoke roles from the browser until the
        authoritative SSLTA role model, server-side authorization checks and RLS policies have been verified.
      </p>
    </div>
  );
}
