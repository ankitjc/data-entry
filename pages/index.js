import { useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function LandingPage() {
    const router = useRouter();
    const [loginCode, setLoginCode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loginCode.trim()) {
            setError("Please enter your login code");
            return;
        }
        setError("");

        // Redirect based on code
        if (loginCode === process.env.NEXT_PUBLIC_ADMIN_ID) {
            router.push(`/admin?loginCode=${loginCode}`);
        } else {
            router.push(`/users?loginCode=${loginCode}`);
        }
    };

    return (
        <>
            <Header title="Data Entry Dashboard" />
            <div className="min-vh-100 d-flex flex-column">
                {/* Centered Login */}
                <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                    <div className="card shadow p-5" style={{ maxWidth: "400px", width: "100%" }}>
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
                </main>
            </div>
        </>

    );
}
