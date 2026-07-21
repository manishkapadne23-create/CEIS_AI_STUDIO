import React from "react";

interface DashboardCardProps {
  title: string;
  icon: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
}) => {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "25px",
        textAlign: "center",
        boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      <div
        style={{
          fontSize: "40px",
          marginBottom: "15px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: 0,
          color: "#1976d2",
        }}
      >
        {title}
      </h3>
    </div>
  );
};

export default DashboardCard;