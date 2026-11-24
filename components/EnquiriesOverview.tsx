type Row = Record<string, unknown>;
type Props = {
  contacts: Row[];
  memberships: Row[];
  contactError: string | null;
  membershipError: string | null;
};

function cell(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function Records({ title, rows, error }: { title: string; rows: Row[]; error: string | null }) {
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row)))).slice(0, 8);
  return (
    <section className="enquiry-section">
      <h2>{title} <span>({rows.length})</span></h2>
      {error ? (
        <p className="empty-state">Could not load this source: {error}</p>
      ) : rows.length === 0 ? (
        <p className="empty-state">No records found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr>{columns.map((column) => <th key={column}>{column.replaceAll("_", " ")}</th>)}</tr></thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={cell(row.id) !== "—" ? cell(row.id) : index}>
                  {columns.map((column) => <td key={column}>{cell(row[column])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function EnquiriesOverview(props: Props) {
  return (
    <div className="enquiries-overview">
      <Records title="Contact enquiries" rows={props.contacts} error={props.contactError} />
      <Records title="Membership applications" rows={props.memberships} error={props.membershipError} />
      <p className="empty-state">
        This first restoration release is read-only. Status changes, assignment and replies should be added
        after confirming the existing table columns and the Federation's response workflow.
      </p>
    </div>
  );
}
