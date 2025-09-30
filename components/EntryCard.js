export default function EntryCard({ entry }) {
    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">
                    {entry.first_name} {entry.last_name}
                </h5>
                <p className="card-text mb-1">
                    <strong>Email:</strong> {entry.email}
                </p>
                <p className="card-text mb-1">
                    <strong>Phone:</strong> {entry.phone || "-"}
                </p>
                <p className="card-text mb-1">
                    <strong>Status:</strong>{" "}
                    <span
                        className={`badge ${
                            entry.status === "Completed"
                                ? "bg-success"
                                : entry.status === "Rejected"
                                    ? "bg-danger"
                                    : entry.status === "In Progress"
                                        ? "bg-warning text-dark"
                                        : "bg-secondary"
                        }`}
                    >
            {entry.status}
          </span>
                </p>
                <p className="card-text">
                    <small className="text-muted">
                        Created At: {new Date(entry.created_at).toLocaleString()}
                    </small>
                </p>
            </div>
        </div>
    );
}
