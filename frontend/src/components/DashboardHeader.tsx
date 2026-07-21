import React from "react";

const DashboardHeader: React.FC = () => {
  return (
    <header
      style={{
        background: "#1976d2",
        color: "#fff",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>PMIS Dashboard</h2>
        <small>Project Management Intelligence System</small>
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <span>👤 Admin</span>

        <button
          style={{
            padding: "8px 15px",
            background: "#ffffff",
            color: "#1976d2",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;