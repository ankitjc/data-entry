import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {useRouter} from "next/router";

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
        status: "Initiated"
    });

    // Fetch user and entries
    useEffect(() => {
        if (!loginCode) return; // wait until loginCode is available

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
                .eq("user_id", userData.id)
                .order("created_at", { ascending: false });

            if (entriesError) return console.error("Entries fetch error:", entriesError.message);
            setEntries(entriesData);
        };

        fetchData();
    }, [loginCode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) return;
        const { data, error } = await supabase
            .from("entries")
            .insert([{ ...formData, user_id: user.id }])
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
                status: "Initiated"
            });
            setShowForm(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Your Entries</h1>

            <button
                className="btn btn-primary mb-3"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Cancel" : "Add New Entry"}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="card p-4 mb-4">
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <button type="submit" className="btn btn-success">
                        Save Entry
                    </button>
                </form>
            )}

            <h2>Entries List</h2>
            {entries.length === 0 ? (
                <p>No entries yet.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entries.map((e) => (
                            <tr key={e.id}>
                                <td>{e.first_name}</td>
                                <td>{e.last_name}</td>
                                <td>{e.email}</td>
                                <td>{e.phone}</td>
                                <td>{e.status}</td>
                                <td>{new Date(e.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
