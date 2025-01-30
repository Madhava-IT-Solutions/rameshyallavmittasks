import { jwtDecode } from 'jwt-decode';
import HomePage from './HomePage';
import ClientDashboard from './ClientDashboard';
import ContractorDashboard from './ContractorDashboard';
import VendorDashboard from './VendorDashboard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const { role } = jwtDecode(token);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove JWT token from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className='dashboard'>
      {role == 'client' && <div> <ClientDashboard/></div>}
      {role == 'contractor' && <div><ContractorDashboard />  </div>}
      {role == 'vendor' && <div><VendorDashboard /></div>}
    </div>
  );
};

export default Dashboard
