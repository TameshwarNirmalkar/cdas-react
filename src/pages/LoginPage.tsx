import React, { useState } from "react";
import { apiCall } from "../services/api";

interface LoginProps {
  onLogin: () => void;
}


const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }
      
      const loginRes = await apiCall(`/auth/login`,{
        method: 'POST',
        body: JSON.stringify({email, password}),
      });
      console.log('========= ', loginRes);
      if(loginRes.token){
        setError("");
        sessionStorage.setItem('token', loginRes.token);
        onLogin();
      } else {
        setError("Invalid email or password");
      }

    } catch (error) {
      console.log("Error", error);
    }

    
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.title}>Login</div>
        {/* <p style={styles.subtitle}>Please enter your details</p> */}

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="admin@test.com"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" style={styles.button}>
          Sign In
        </button>
      </form>
    </div>
  );
};

// Simple inline styles for a quick start
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: { margin: "0 0 10px 0", textAlign: "center" },
  subtitle: { color: "#666", textAlign: "center", marginBottom: "20px" },
  error: {
    color: "red",
    backgroundColor: "#fee",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  inputGroup: { marginBottom: "15px" },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default LoginPage;
