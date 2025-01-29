import{React, useState, useEffect } from "react";
import { data, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Select from "react-select";
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

import "./Dashboard.css"
import "./ClientDashboard.css"

import "./VendorDashboard.css"


import '../App.css';


// Vendor Dashboard Components
const VendorProfile = ({ profile }) => {
  return (
    <div className="vendor-profile">
      <h2 className="vendor-profile-title">Vendor Profile</h2>
      <p className="vendor-profile-text"><strong>Name:</strong> {profile.name}</p>
      <p className="vendor-profile-text"><strong>Email:</strong> {profile.email}</p>
      <p className="vendor-profile-text"><strong>Products:</strong> {profile.products.join(', ')}</p>
    </div>
  );
};

const OrderList = ({ orders }) => {
  return (
    <div className="order-list">
      <h2 className="order-list-title">Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="order-item">
          <h3 className="order-item-title">Order {order.id}</h3>
          <p className="order-item-status">Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

const VendorDashboard = () => {
    const [tenders, setTenders] = useState([]);
    const [activeTenders,setactiveTenders] = useState([])
    const [myTenders,setMyTenders] = useState([])
    const [archive, setArchive] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [applications, setApplications] = useState([]);
    const [contractors, setContractors] = useState([]);
    
    const itemsPerPage = 5;

    const token = localStorage.getItem('token');
    const { role } = jwtDecode(token);
          useEffect(() => {
            loadTenders();
            loadApplications();
            loadContractors();
          }, []);
    
    const loadContractors = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/home/api/contractors`);
        console.log(data);
        setContractors(data); // Update state with contractor data
      } catch (error) {
        console.error("Failed to load contractors:", error);
      }
    };
    
    const loadApplications = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/home/api/Contractor-applications/${userDetails.id}`);
        const applications = data
  
        setApplications(applications)
      } catch (error) {
        console.error("Failed to load applications:", error);
      }
    };
  const loadTenders = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/home/api/tenders");
      const currentDate = new Date().toISOString().split("T")[0];
      const activeTenders = data.filter((tender) => tender.tender_response_by > currentDate);
      const archivedTenders = data.filter((tender) => tender.tender_response_by <= currentDate);
      const myTenders = data.filter((tender) => tender.client_id === userDetails.id) 
      setactiveTenders(activeTenders);
      setArchive(archivedTenders);    
      setMyTenders(myTenders)
    } catch (error) {
      console.error("Failed to load tenders:", error);
    }
  };


  const filteredTenders = activeTenders.filter((tender) =>
    [ tender.name_of_work, tender.state, tender.district, tender.place, tender.nature_of_work]
      .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  const displayTenders = filteredTenders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    const totalPages = Math.ceil(filteredTenders.length / itemsPerPage);
    if (currentPage + direction > 0 && currentPage + direction <= totalPages) {
      setCurrentPage(currentPage + direction);
    }
  };

  const handleApply = (tenderId) => {
    navigate(`/apply/${tenderId}`);
  };

  const handleArchiveClick = () => {
    navigate("/archive");}



  const vendorProfile = {
    name: 'Vendor Company',
    email: 'vendor@example.com',
    products: ['Materials', 'Equipment', 'Tools'],
  };

  const orders = [
    { id: 1, status: 'Shipped' },
    { id: 2, status: 'Pending' },
  ];



  const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem('token'); // Remove JWT token from localStorage
      navigate('/login'); // Redirect to login page
    };

    const getUserDetails = () => {
      const userDetailsString = localStorage.getItem('userDetails');
    
      if (!userDetailsString) {
        console.log('No user details found in localStorage');
        return null; // Return null if no data is found
      }
    
      try {
        const userDetails = JSON.parse(userDetailsString);
        return userDetails; // Return the parsed object
      } catch (error) {
        console.error('Error parsing user details:', error);
        return null;
      }
    };
    
    const userDetails =getUserDetails()

    const ClientProfile = ({ profile }) => {
      return (
        <>
          <div className="vendor_profile-card">
            <div className="profile-image">
              <img
                src={userDetails.image}
                alt="Profile"
                className="image"
              />
            </div>
            <div className="profile-info">
              <h2 className="username">{userDetails.username}</h2>
              <p className="email">{userDetails.email}</p>
              <p className="about">
                Passionate bussiness person with experience in building scalable web
                applications. Always eager to learn new technologies and improve my
                skills.
              </p>
              <div className="social-media">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <FontAwesomeIcon icon={faGithub} />
                </a>
              </div>
            </div>
          </div>
          </>
      );
    };
    
    

  return (
    <>
            <nav className="d-navbar">
          <h2>Vendor Dashboard</h2>
          <div className='right-nav'>
          <ul>
            <li>Home</li>
            <li>My Applications</li>
           
            <li>Contractors</li>

            <li>Clients</li>

            <li>Orders</li>

          </ul>
          <button className='logbutton' onClick={handleLogout} > Logout </button>
          </div>
        </nav>
    <div className="vendor-dashboard-page vendor-dashboard-container">



        <div id = "vendor-profile" className="vendor_pr">
      
          <div className="vendor_ca">
    
          <ClientProfile />
          
          
          </div>
    
        
        </div>


        <div className="vendor_tendersCard">
          <div>
            <h2>Active Tenders</h2>
            <table>
              <thead>
                <tr>
                  <th>Tender ID</th>
                  <th>Tender Posted By</th>
                  <th>Work Description</th>
                  <th>Location</th>
                  <th>Nature of Work</th>
                  <th>Tender Published On</th>
                  <th>Tender Response By</th>
                  <th>BoQ</th>
                  <th>Apply</th>
                </tr>
              </thead>
              <tbody>
                {displayTenders.map((tender) => (
                  <tr key={tender.tender_id}>
                    <td key={tender.tender_id}>{tender.tender_id}</td>
                    <td>{tender.client_name}</td>
                    <td>{tender.name_of_work}</td>
                    <td>{tender.state}</td>
                    <td>{tender.nature_of_work}</td>
                    <td>{tender.tender_published_on}</td>
                    <td>{tender.tender_response_by}</td>
                    <td>
                      <a href={`/uploads/${tender.boq_file}`} download>
                        Download
                      </a>
                    </td>
                    <td>
                      <button onClick={() => handleApply(tender.tender_id)}>Apply</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


            <div className="paginationCard">
                <button onClick={() => handlePageChange(-1)}>Previous</button>
                  <span>
                    Page {currentPage} of {Math.ceil(filteredTenders.length / itemsPerPage)}
                  </span>
                <button onClick={() => handlePageChange(1)}>Next</button>
            </div>


        </div>


                            
        <div id="applications" className="tendersCard">
                      <div>
                        <h2>My Applications</h2>
                        <table>
                          <thead>
                            <tr>
                              <th>Tender ID</th>
                              <th>Tender Name</th>
                              <th>Tender Budget</th>
                              <th>Bid Amount</th>
                              <th>Applied On</th>
                              <th>Deadline</th>
                            </tr>
                          </thead>
                          <tbody className="applications-tbody">
                            {applications.map((application) => (
                              <tr key={application.id}>
                                <td>{application.tender_id}</td>
                                <td>{application.tender_name}</td>
                                <td>{application.tender_budget}</td>
                                <td>{application.bid_amount}</td>
                                <td>{application.submitted_on}</td>
                                <td>{application.tender_deadline}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

        </div>


        <div id="contractors" className="tendersCard">
          <div>
            <h2>Contractors</h2>
            <table>
              <thead>
                <tr>
                  <th>Contractor Name</th>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Experience</th>
                  <th>License Number</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {contractors.map((contractor) => (
                  <tr key={contractor.contractor_id}>
                    <td>{contractor.username}</td>
                    <td>{contractor.company_name}</td>
                    <td>{contractor.email}</td>
                    <td>{contractor.phone}</td>
                    <td>{contractor.experience}</td>
                    <td>{contractor.license_number}</td>
                    <td>Contact</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      
    </div>

    </>
  );
};

export default VendorDashboard;