import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider, useAuth } from "./AuthContext";
import App from "./App";
import AuthPage from "./AuthPage";
import "./App.css";

function Root() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0f1a",
        color: "#6366f1",
        fontSize: "18px",
        fontFamily: "sans-serif",
      }}>
        Loading...
      </div>
    );
  }

  return user ? <App /> : <AuthPage />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </React.StrictMode>
);