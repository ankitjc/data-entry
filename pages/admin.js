import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {

    const [users, setUsers] = useState([]);
    const [entries, setEntries] = useState([]);
    const [showUserForm, setShowUserForm] = useState(false);
    const [userFormData, setUserFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        login_code: "",
    });

    // Fetch all users and entries
    useEffect(() => {
        const fetchData = async () => {
            const { data: usersData } = await supabase.from("users").select("*");
            setUsers(usersData || []);

            const { data: entriesData } = await supabase
                .from("entries")
                .select("*")
                .order("created_at", { ascending: false });
            setEntries(entriesData || []);
        };

        fetchData();
    }, []);

    // User form handlers
    const handleUserChange = (e) =>
        setUserFormData({ ...userFormData, [e.target.name]: e.target.value });

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("users")
            .insert([userFormData])
            .select()
            .single();

        if (error) {
            alert("Error creating user: " + error.message);
        } else {
            setUsers([data, ...users]);
            setUserFormData({ first_name: "", last_name: "", email: "", login_code: "" });
            setShowUserForm(false);
        }
    };

    // Inline status update handler
    const handleStatusChange = async (entryId, newStatus) => {
        const { data, error } = await supabase
            .from("entries")
            .update({ status: newStatus })
            .eq("id", entryId)
            .select();

        if (error) {
            alert("Error updating status: " + error.message);
        } else {

            const updatedEntries = entries.map((entry) =>
                entry.id === entryId ? { ...entry, status: newStatus } : entry
            );
            setEntries(updatedEntries);

        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Admin Dashboard</h1>

            {/* Add User Section */}
            <button
                className="btn btn-primary mb-3"
                onClick={() => setShowUserForm(!showUserForm)}
            >
                {showUserForm ? "Cancel" : "Add New User"}
            </button>

            {showUserForm && (
                <form onSubmit={handleUserSubmit} className="card p-4 mb-4 shadow-sm">
                    <h5 className="card-title mb-3">Add New User</h5>
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={userFormData.first_name}
                            onChange={handleUserChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={userFormData.last_name}
                            onChange={handleUserChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userFormData.email}
                            onChange={handleUserChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Login Code</label>
                        <input
                            type="text"
                            name="login_code"
                            value={userFormData.login_code}
                            onChange={handleUserChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-success">
                        Save User
                    </button>
                </form>
            )}

            {/* Users List */}
            <h2>Users</h2>
            <ul className="list-group mb-4">
                {users.map((u) => (
                    <li key={u.id} className="list-group-item">
                        {u.first_name} {u.last_name} ({u.email}) - Code: {u.login_code}
                    </li>
                ))}
            </ul>

            {/* Entries Table */}
            <h2>All Entries</h2>
            {entries.length === 0 ? (
                <p>No entries available.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                        <tr>
                            <th>User ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entries.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.user_login_code}</td>
                                <td>{entry.first_name}</td>
                                <td>{entry.last_name}</td>
                                <td>{entry.email}</td>
                                <td>{entry.phone}</td>
                                <td>
                                    <select
                                        className="form-select"
                                        value={entry.status}
                                        onChange={(e) =>
                                            handleStatusChange(entry.id, e.target.value)
                                        }
                                    >
                                        <option>Initiated</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                        <option>Rejected</option>
                                    </select>
                                </td>
                                <td>{new Date(entry.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
