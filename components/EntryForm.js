import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EntryForm({ userId, onEntryAdded }) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        status: "Initiated",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) return;

        const { data, error } = await supabase
            .from("entries")
            .insert([{ ...formData, user_id: userId }])
            .select()
            .single();

        if (error) {
            console.error("Error creating entry:", error.message);
            alert("Error creating entry");
        } else {
            onEntryAdded(data);
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                status: "Initiated",
            });
        }
    };

    return (
        <div className="card p-4 mb-4 shadow-sm">
            <h5 className="card-title mb-3">Add New Entry</h5>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option>Initiated</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Rejected</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-success">
                    Save Entry
                </button>
            </form>
        </div>
    );
}
