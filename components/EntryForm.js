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

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

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
        <div className="card p-3 mb-4 shadow-sm">
            <h5 className="card-title mb-3">Add New Entry</h5>
            <form onSubmit={handleSubmit}>
                <div className="row g-2">
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="first_name"
                            className="form-control"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="last_name"
                            className="form-control"
                            placeholder="Last Name"
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
                            className="form-control"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mt-2">
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

                <button type="submit" className="btn btn-success mt-3">
                    Save Entry
                </button>
            </form>
        </div>
    );
}
