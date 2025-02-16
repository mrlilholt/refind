import React, { useState } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import googleLogo from "../assets/google-logo.png";
import refindLogo from "../assets/refind-logo.png";
import "./Login.css";

const Login = () => {
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    textAlign: "center",
    fontFamily: "'Quicksand', sans-serif",
  };

  // eslint-disable-next-line no-unused-vars
  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    marginTop: "20px",
    fontSize: "16px",
    cursor: "pointer",
  };

  const googleLogoStyle = {
    width: "20px",
    marginRight: "10px",
  };

  const refindLogoStyle = {
    width: "150px",
    marginBottom: "20px",
  };

  return (
    <div style={containerStyle}>
      <img src={refindLogo} alt="Re-Find Logo" style={refindLogoStyle} />
      <h2>Login to Re-Find</h2>
      {error && <p>{error}</p>}
      <button onClick={handleGoogleLogin} className="login-button">
        <img src={googleLogo} alt="Google Logo" style={googleLogoStyle} />
        Login with Google
      </button>
    </div>
  );
};

export default Login;