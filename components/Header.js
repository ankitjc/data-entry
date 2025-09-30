// components/Header.js
import Link from "next/link";

export default function Header({ title }) {
    return (
        <header className="navbar navbar-expand-lg px-3 shadow-sm">
            <div className="container-fluid">
                <Link href="/" className="navbar-brand d-flex align-items-center">
                    <img
                        src="/logo.png"
                        alt="Company Logo"
                        style={{ height: "40px", marginRight: "10px" }}
                    />
                    <span className="fw-bold">{title}</span>
                </Link>

                <div className="d-flex">
                    <Link href="/" className="btn btn-dark ms-3">
                        Logout
                    </Link>
                </div>
            </div>
        </header>
    );
}
