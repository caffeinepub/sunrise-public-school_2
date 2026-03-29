import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { SCHOOL_INFO } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Login() {
  const { login, isLoggingIn } = useInternetIdentity();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-icon">
            <GraduationCap size={48} />
          </div>
          <h1>{SCHOOL_INFO.name}</h1>
          <p>
            Est. {SCHOOL_INFO.yearEstablished} &nbsp;|&nbsp; Affil:{" "}
            {SCHOOL_INFO.affiliation}
          </p>
          <p>{SCHOOL_INFO.email}</p>
        </div>
        <div className="login-tagline">
          Empowering Education Through Technology
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <h2>Teacher Login</h2>
          <p>Sign in with Internet Identity to access the management system.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={handleLogin}
            disabled={loading || isLoggingIn}
          >
            {loading || isLoggingIn
              ? "Connecting..."
              : "Login with Internet Identity"}
          </button>
          <div className="login-note">
            Secure authentication powered by Internet Computer
          </div>
        </div>
      </div>
    </div>
  );
}
