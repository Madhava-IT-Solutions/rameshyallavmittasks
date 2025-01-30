import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientDashboard from "./ClientDashboard";
import ContractorDashboard from "./ContractorDashboard";
import VendorDashboard from "./VendorDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const { role } = jwtDecode(token);
      setRole(role);
      setLoading(false);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      {role === "client" && <ClientDashboard />}
      {role === "contractor" && <ContractorDashboard />}
      {role === "vendor" && <VendorDashboard />}
    </div>
  );
};

export default Dashboard;
