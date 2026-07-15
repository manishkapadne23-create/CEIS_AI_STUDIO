import React from "react";

const Dashboard = () => {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#1976d2" }}>
        PMIS Dashboard
      </h1>

      <p>Welcome to Project Management Intelligence System</p>

      <hr />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={cardStyle}>📁 Projects</div>
        <div style={cardStyle}>📄 Documents</div>
        <div style={cardStyle}>👥 Users</div>
        <div style={cardStyle}>📅 Tasks</div>
        <div style={cardStyle}>🤖 AI Assistant</div>
        <div style={cardStyle}>📊 Reports</div>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  padding: "25px",
  borderRadius: "12px",
  textAlign: "center",
  fontSize: "20px",
  fontWeight: "bold",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  cursor: "pointer",
};

export default Dashboard;