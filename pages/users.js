import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import DataTable from "react-data-table-component";

export default function UserPage() {
    const router = useRouter();
    const { loginCode } = router.query; // get loginCode from URL
    const [entries, setEntries] = useState([]);
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        status: "Initiated",
    });

    // Fetch user and entries
    useEffect(() => {
        if (!loginCode) return;

        const fetchData = async () => {
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("login_code", loginCode)
                .single();

            if (userError) return console.error("User fetch error:", userError.message);
            setUser(userData);

            const { data: entriesData, error: entriesError } = await supabase
                .from("entries")
                .select("*")
                .eq("user_login_code", userData.login_code)
                .order("created_at", { ascending: false });

            if (entriesError) return console.error("Entries fetch error:", entriesError.message);
            setEntries(entriesData);
        };

        fetchData();
    }, [loginCode]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        const { data, error } = await supabase
            .from("entries")
            .insert([{ ...formData, user_login_code: user.login_code }])
            .select()
            .single();

        if (error) {
            console.error("Insert entry error:", error.message);
            alert("Error creating entry");
        } else {
            setEntries([data, ...entries]);
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                status: "Initiated",
            });
            setShowForm(false);
        }
    };

    const columns = [
        { name: "First Name", selector: (row) => row.first_name, sortable: true },
        { name: "Last Name", selector: (row) => row.last_name, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        { name: "Phone", selector: (row) => row.phone, sortable: true },
        { name: "Status", selector: (row) => row.status, sortable: true },
        {
            name: "Created At",
            selector: (row) => new Date(row.created_at).toLocaleString(),
            sortable: true,
        },
    ];

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Your Entries</h1>

            <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "Add New Entry"}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
                    <div className="row g-2">
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                className="form-control"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                className="form-control"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
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
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success mt-3">
                        Save Entry
                    </button>
                </form>
            )}

            <h2>Entries List</h2>
            <DataTable
                columns={columns}
                data={entries}
                pagination
                highlightOnHover
                dense
                responsive
            />
        </div>
    );
}
