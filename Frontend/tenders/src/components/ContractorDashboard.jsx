import{React, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

import "./ContractorDashboard1.css"

  // Sample Data
const portfolioData = [
  {
    id: 1,
    title: "Residential Building Project",
    description: "Constructed a modern 10-story residential complex.",
    date: "Completed: June 2023",
    image: "https://www.ashiaestates.com/blog/wp-content/uploads/2021/10/new.jpg",
  },
  {
    id: 2,
    title: "Bridge Construction",
    description: "Built a 500m-long bridge over the river.",
    date: "Completed: Jan 2022",
    image: "https://www.preeticdpl.com/uploads/01b.jpg",
  },
  {
    id: 3,
    title: "Luxury Villa Renovation",
    description: "Renovated a luxury villa with smart home features.",
    date: "Completed: Dec 2021",
    image: "https://static.wixstatic.com/media/0451c2_18a715d5850a4ba2992ce01f5fb188db~mv2.jpg/v1/fill/w_1920,h_1080,al_c/0451c2_18a715d5850a4ba2992ce01f5fb188db~mv2.jpg",
  },
];
   
const profile = {
      name: "ABC Constructions",
      contact: "abc@contractors.com",
      industry: "Construction",
      services: "Building, Renovation",
      location: "New York, USA",
      certifications: ["ISO 9001", "Safety Certified"],
      experience: "10+ Years",
      portfolio: [
          { id: 1, name: "Project A", image: "https://via.placeholder.com/100", description: "Luxury Apartment" },
          { id: 2, name: "Project B", image: "https://via.placeholder.com/100", description: "Commercial Complex" }
      ],
      ratings: 4.8
};


const ContractorDashboard = () => {
  const token = localStorage.getItem('token');
  const { role } = jwtDecode(token);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove JWT token from localStorage
    navigate('/login'); // Redirect to login page
  };

  const [activeTenders,setactiveTenders] = useState([])
  const [archive, setArchive] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [contractors, setContractors] = useState([]);

  const itemsPerPage = 5;
  
 
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
      setactiveTenders(activeTenders);
      setArchive(archivedTenders);
      console.log(data)
      
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
  
  const userDetails = getUserDetails()
  
  const ClientProfile = () => {
    return (
      <>
        <div className="profile-card">
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
                        <p><strong>Company:</strong> {profile.name}</p>
                        <p><strong>Contact:</strong> {profile.contact}</p>
                        <p><strong>Industry:</strong> {profile.industry}</p>
                        <p><strong>Services:</strong> {profile.services}</p>
                        <p><strong>Location:</strong> {profile.location}</p>
                        <p><strong>Certifications:</strong> {profile.certifications.join(", ")}</p>
                        <p><strong>Experience:</strong> {profile.experience}</p>
                        
            <div className="social-media">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
        </>
    );
  };

     const [activeSection, setActiveSection] = useState('profile');
      
 
  
      const tenders1 = [
          { id: 1, title: "Road Construction", deadline: "Feb 15, 2025", requirements: "Experience: 5+ years" },
          { id: 2, title: "Bridge Renovation", deadline: "Mar 10, 2025", requirements: "ISO Certification Required" }
      ];
  
      const bids = [
          { id: 1, tender: "Road Construction", status: "Pending" },
          { id: 2, tender: "Bridge Renovation", status: "Shortlisted" }
      ];
  
      const notifications = ["New tender posted: Hospital Renovation", "Your bid for Bridge Renovation is shortlisted"];
      const payments = [{ id: 1, project: "Bridge Renovation", amount: "$20,000", status: "Pending" }];
      

  return (
    

    <div >
     <nav className="contractor-navbar d-navbar">
        <h2>{role.toUpperCase()} Dashboard</h2>
        <div className='right-nav'>
            <ul>
              <li>Home</li>
              <li>My Applications</li>
              <li>Clients</li>
              <li>Contractors</li>
              <li>Vendors</li>
            </ul>
            <button className='logbutton' onClick={handleLogout} > Logout </button>
        </div>
     </nav>


     <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                {/* <ul>
                    <li className="sidebar-item" onClick={() => setActiveSection('profile')}>Profile</li>
                    <li className="sidebar-item" onClick={() => setActiveSection('tenders')}>Available Tenders</li>
                    <li className="sidebar-item" onClick={() => setActiveSection('bids')}>My Bids</li>
                    <li className="sidebar-item" onClick={() => setActiveSection('notifications')}>Notifications</li>
                    <li className="sidebar-item" onClick={() => setActiveSection('payments')}>Financial Overview</li>
                </ul> */}
                <ul>
                <a href="#profile"><li className="sidebar-item" >Profile</li></a>
                <a href="#tenders"><li className="sidebar-item" >Available Tenders</li></a>
                <a href="#bids"><li className="sidebar-item" >My Bids</li></a>
                <a href="#notifications"><li className="sidebar-item" >Notifications</li></a>
                <a href="#payments"><li className="sidebar-item">Financial Overview</li></a>
                </ul>
            </div>

            {/* Main Content */}
            <div  className="main-content">
  
                    <div id="profile"  className="profile height row" >
                          <div className="portfolio-container">
                            <h2>My Portfolio</h2>
                                  {portfolioData.map((project) => (
                                    <div key={project.id} className="portfolio-card">
                                      <img src={project.image} alt={project.title} className="portfolio-img" />
                                      <div className="portfolio-info">
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>
                                        <span className="portfolio-date">{project.date}</span>
                                      </div>
                                    </div>
                                  ))}
                          </div>
                      <ClientProfile />
                    </div>

                    <div id = "tenders" className="height ">
                        <div className="tendersCard">
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
                                      <td>{new Date(tender.tender_published_on).toLocaleDateString()}</td>
                                      <td>{new Date(tender.tender_response_by).toLocaleDateString()}</td>
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

                        {/* <div className="Active-Tenders">
                            <h2>Available Tenders</h2>
                            <table className="tender-table">
                              <thead className="tender-table__header">
                                <tr className="tender-table__header-row">
                                  <th className="tender-table__header-cell">Tender ID</th>
                                  <th className="tender-table__header-cell">Tender Posted By</th>
                                  <th className="tender-table__header-cell">Work Description</th>
                                  <th className="tender-table__header-cell">Location</th>
                                  <th className="tender-table__header-cell">Nature of Work</th>
                                  <th className="tender-table__header-cell">Tender Published On</th>
                                  <th className="tender-table__header-cell">Tender Response By</th>
                                  <th className="tender-table__header-cell">BoQ</th>
                                  <th className="tender-table__header-cell">Apply</th>
                                </tr>
                              </thead>
                              <tbody className="tender-table__body">
                                {displayTenders.map((tender) => (
                                  <tr key={tender.id} className="tender-table__body-row">
                                    <td className="tender-table__body-cell">{tender.tender_id}</td>
                                    <td className="tender-table__body-cell">{tender.client_name}</td>
                                    <td className="tender-table__body-cell">{tender.name_of_work}</td>
                                    <td className="tender-table__body-cell">{tender.state}</td>
                                    <td className="tender-table__body-cell">{tender.nature_of_work}</td>
                                    <td>{new Date(tender.tender_published_on).toLocaleDateString()}</td>
                                    <td>{new Date(tender.tender_response_by).toLocaleDateString()}</td>
                                    <td className="tender-table__body-cell">
                                      <a
                                        href={`/uploads/${tender.boq_file}`}
                                        download
                                        className="tender-table__download-link"
                                      >
                                        Download
                                      </a>
                                    </td>
                                    <td className="tender-table__body-cell">
                                      <button
                                        onClick={() => handleApply(tender.tender_id)}
                                        className="tender-table__apply-button"
                                      >
                                        Apply
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                        </div>
                        <div className='paginationCard'>
                              <button onClick={() => handlePageChange(-1)}>Previous</button>
                              <span>
                                Page {currentPage} of {Math.ceil(filteredTenders.length / itemsPerPage)}
                              </span>
                              <button onClick={() => handlePageChange(1)}>Next</button>
                        </div> */}
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

                    <div id = "bids" className="height ">
                        <h2 className="section-title">My Bids</h2>
                        {bids.map((bid) => (
                            <div key={bid.id} className="bid-item">
                                <p><strong>Tender:</strong> {bid.tender}</p>
                                <p><strong>Status:</strong> {bid.status}</p>
                            </div>
                        ))}
                    </div>

                    <div id = "notifications" className="height">
                        <h2 className="section-title">Notifications</h2>
                        <ul>
                            {notifications.map((note, index) => (
                                <li key={index} className="notification-item">{note}</li>
                            ))}
                        </ul>
                    </div>

                    <div id = "payments" className="height ">
                        <h2 className="section-title">Financial Overview</h2>
                        {payments.map((payment) => (
                            <div key={payment.id} className="payment-item">
                                <p><strong>Project:</strong> {payment.project}</p>
                                <p><strong>Amount:</strong> {payment.amount}</p>
                                <p><strong>Status:</strong> {payment.status}</p>
                            </div>
                        ))}
                    </div>
            </div>
        </div>


</div>





  );
};

export default ContractorDashboard;
