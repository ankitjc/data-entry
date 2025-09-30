import {useState} from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";

export default function LandingPage() {
    const [loginCode, setLoginCode] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loginCode.toLowerCase() === "admin") {
            await router.push({
                pathname: "/admin",
                query: {loginCode: loginCode},
            });
        } else {
            // Fetch user by loginCode
            const {data: user, error} = await supabase
                .from("users")
                .select("*")
                .eq("login_code", loginCode)
                .single();

            if (error || !user) {
                setError("Invalid login code");
                return;
            }

            await router.push({
                pathname: "/users",
                query: {loginCode: loginCode},
            });
        }
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="card p-5 shadow" style={{maxWidth: "400px", width: "100%"}}>
                <h2 className="mb-4 text-center">Welcome to Hishobnis</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="loginCode" className="form-label">
                            Login Code
                        </label>
                        <input
                            type="text"
                            id="loginCode"
                            className="form-control"
                            value={loginCode}
                            onChange={(e) => setLoginCode(e.target.value)}
                            required
                            placeholder="Enter your login code"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
