import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case "GET": {
            try {
                const { data, error } = await supabase.from("users").select("*");
                if (error) throw error;
                return res.status(200).json(data);
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }

        case "POST": {
            try {
                const user = req.body;
                const { data, error } = await supabase.from("users").insert([user]);
                if (error) throw error;
                return res.status(201).json(data);
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }

        case "DELETE": {
            try {
                const { login_code } = req.query;
                const { data, error } = await supabase.from("users").delete().eq("login_code", login_code);
                if (error) throw error;
                return res.status(200).json(data);
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }

        default:
            res.setHeader("Allow", ["GET", "POST", "DELETE"]);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}
