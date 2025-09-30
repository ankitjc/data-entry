import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import DataTable from "react-data-table-component";
import Header from "@/components/Header";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [showUserForm, setShowUserForm] = useState(false);
    const [userFormData, setUserFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        login_code: "",
    });
    const [createdByFilter, setCreatedByFilter] = useState("");

    // Fetch users and entries
    useEffect(() => {
        const fetchData = async () => {
            const { data: usersData } = await supabase.from("users").select("*");
            setUsers(usersData || []);

            const { data: entriesData } = await supabase
                .from("entries")
                .select("*")
                .order("created_at", { ascending: false });
            setEntries(entriesData || []);
            setFilteredEntries(entriesData || []);
        };
        fetchData();
    }, []);

    // Filter entries when Created By filter changes
    useEffect(() => {
        const filtered = entries.filter((e) =>
            e.user_login_code.toLowerCase().includes(createdByFilter.toLowerCase())
        );
        setFilteredEntries(filtered);
    }, [createdByFilter, entries]);

    const handleUserChange = (e) =>
        setUserFormData({ ...userFormData, [e.target.name]: e.target.value });

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("users")
            .insert([userFormData])
            .select()
            .single();

        if (error) alert("Error creating user: " + error.message);
        else {
            setUsers([data, ...users]);
            setUserFormData({ first_name: "", last_name: "", email: "", login_code: "" });
            setShowUserForm(false);
        }
    };

    const handleStatusChange = async (entryId, newStatus) => {
        const { data, error } = await supabase
            .from("entries")
            .update({ status: newStatus })
            .eq("id", entryId)
            .select();

        if (error) alert("Error updating status: " + error.message);
        else {
            const updated = entries.map((entry) =>
                entry.id === entryId ? { ...entry, status: newStatus } : entry
            );
            setEntries(updated);
        }
    };

    const userColumns = [
        { name: "First Name", selector: (row) => row.first_name, sortable: true },
        { name: "Last Name", selector: (row) => row.last_name, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        { name: "Login Code", selector: (row) => row.login_code, sortable: true },
    ];

    const entryColumns = [
        { name: "First Name", selector: (row) => row.first_name, sortable: true },
        { name: "Last Name", selector: (row) => row.last_name, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        { name: "Phone", selector: (row) => row.phone, sortable: true },
        {
            name: "Status",
            cell: (row) => (
                <select
                    className="form-select"
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                >
                    <option>Initiated</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Rejected</option>
                </select>
            ),
        },
        { name: "Created By", selector: (row) => row.user_login_code, sortable: true },
        {
            name: "Created At",
            selector: (row) => new Date(row.created_at).toLocaleString(),
            sortable: true,
        },
    ];

    return (
        <>
            <Header title="Admin Dashboard" />
            <div className="container mt-5">
                {/* Add User Form */}
                <button
                    className="btn btn-primary mb-3"
                    onClick={() => setShowUserForm(!showUserForm)}
                >
                    {showUserForm ? "Cancel" : "Add New User"}
                </button>
                {showUserForm && (
                    <form onSubmit={handleUserSubmit} className="card p-3 mb-4 shadow-sm">
                        <h5 className="card-title mb-3">Add New User</h5>
                        <div className="row g-2">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="First Name"
                                    className="form-control"
                                    value={userFormData.first_name}
                                    onChange={handleUserChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Last Name"
                                    className="form-control"
                                    value={userFormData.last_name}
                                    onChange={handleUserChange}
                                />
                            </div>
                        </div>

                        <div className="row g-2 mt-2">
                            <div className="col-md-6">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control"
                                    value={userFormData.email}
                                    onChange={handleUserChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    name="login_code"
                                    placeholder="Login Code"
                                    className="form-control"
                                    value={userFormData.login_code}
                                    onChange={handleUserChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-success mt-3">
                            Save User
                        </button>
                    </form>
                )}

                {/* Users Table */}
                <h2>Users</h2>
                <DataTable
                    columns={userColumns}
                    data={users}
                    pagination
                    highlightOnHover
                    striped
                />

                {/* Entries Table with Created By Filter */}
                <h2 className="mt-4">All Entries</h2>
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Filter by Created By"
                        value={createdByFilter}
                        onChange={(e) => setCreatedByFilter(e.target.value)}
                        className="form-control"
                    />
                </div>
                <DataTable
                    columns={entryColumns}
                    data={filteredEntries}
                    pagination
                    highlightOnHover
                    striped
                />
            </div>
        </>
    );
}
