import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case "GET": {
            try {
                const { login_code } = req.query;
                let query = supabase.from("entries").select("*");
                if (login_code) query = query.eq("login_code", login_code);

                const { data, error } = await query;
                if (error) throw error;

                return res.status(200).json(data);
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }

        case "POST": {
            try {
                const entry = req.body;
                const { data, error } = await supabase.from("entries").insert([entry]);
                if (error) throw error;
                return res.status(201).json(data);
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }

        case "PUT": {
            try {
                const { id, ...updates } = req.body;
                const { data, error } = await supabase
                    .from("entries")
                    .update(updates)
                    .eq("id", id);
                if (error) throw error;
                return res.status(200).json(data);
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }

        case "DELETE": {
            try {
                const { id } = req.query;
                const { data, error } = await supabase.from("entries").delete().eq("id", id);
                if (error) throw error;
                return res.status(200).json(data);
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }

        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}
