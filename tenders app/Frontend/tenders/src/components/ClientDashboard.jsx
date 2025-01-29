import{React, useState, useEffect } from "react";
import { data, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Select from "react-select";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

import "./Dashboard.css"
import "./ClientDashboard.css"
import "./Homepage.css";


import '../App.css';




const ClientDashboard = () => {
  const token = localStorage.getItem('token');
  const { role } = jwtDecode(token);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove JWT token from localStorage
    navigate('/login'); // Redirect to login page
  };

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({
    name_of_work: "",
    area: "",
    plinth_area: "",
    state: "",
    district: "",
    place: "",
    nature_of_work: "",
    tender_published_on: "",
    tender_response_by: "",
    client_id:""
  });
  const [userDetails, setUserDetails] = useState({});
  const [tenders, setTenders] = useState([]);
  const [activeTenders,setactiveTenders] = useState([])
  const [myTenders,setMyTenders] = useState([])
  const [archive, setArchive] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [displayTenders1, setDisplayTenders] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const itemsPerPage = 5;

  useEffect(() => {
    const loadTenders = async () => {
      try {
        const { data } = await axios.get("https://tenders-server.onrender.com/home/api/tenders");
        setTenders(data);
        setDisplayTenders(data);
      } catch (error) {
        console.error("Failed to load tenders:", error);
      }
    };
    loadTenders();
   
  }, []);
  


  const filterTenders = (type) => {
    setFilterType(type);
    if (type === "All") {
      setDisplayTenders(tenders);
    } else {
      setDisplayTenders(tenders.filter((tender) => tender.tender_type === type));
    }
  };

  const handlePageChangel = (direction) => {
    setCurrentPage((prevPage) => Math.max(1, prevPage + direction));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTenders = displayTenders1.slice(startIndex, startIndex + itemsPerPage);



  
  const statesAndDistricts = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari"],
    "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng"],
    Assam: ["Barpeta", "Bongaigaon", "Cachar"],
    Bihar: ["Araria", "Aurangabad", "Banka"],
  };

  const natureOfWorkOptions = [
    "AAC Block Work",
    "ACP Cladding",
    "Acoustic Work",
    "Anti Termite treatment",
    "Boundary Wall",
    "Bridge",
    "Buildings",
  ];

 


  const handleStateChange = (selectedState) => {
    setForm({ ...form, state: selectedState });
    setDistricts(statesAndDistricts[selectedState] || []);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(form)
  
    // Create FormData object to append form fields
    const formData = new FormData();
    formData.append("name_of_work", form.name_of_work);
    formData.append("area", form.area);
    formData.append("plinth_area", form.plinth_area);
    formData.append("state", form.state);
    formData.append("district", form.district);
    formData.append("place", form.place);
    formData.append("nature_of_work", form.nature_of_work);
    formData.append("tender_published_on", form.tender_published_on);
    formData.append("tender_response_by", form.tender_response_by);
    formData.append('client_id' , userDetails.id);
    
    console.log(formData)
    try {
      const res = await axios.post('https://tenders-server.onrender.com/home/api/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      console.log('Tender submitted successfully:', res.data);
      alert('Tender submitted successfully');
    } catch (err) {
      console.error('Error submitting tender:', err);
      alert('Failed to submit tender');
    }
  };



  const getUserDetails = async () => {
    const userDetailsString = localStorage.getItem('userDetails');
  
    if (!userDetailsString) {
      console.log('No user details found in localStorage');
      return null; // Return null if no data is found
    }
  
    try {
      const userDetails = await JSON.parse(userDetailsString);
      setUserDetails(userDetails) // Return the parsed object
    } catch (error) {
      console.error('Error parsing user details:', error);
      return null;
    }
  };
  


  const loadContractors = async () => {
    try {
      const { data } = await axios.get(`https://tenders-server.onrender.com/home/api/contractors`);
      setContractors(data); // Update state with contractor data
    } catch (error) {
      console.error("Failed to load contractors:", error);
    }
  };
  
  
  const loadApplications = async () => {
    try {
      const { data } = await axios.get(`https://tenders-server.onrender.com/home/api/applications/${userDetails.id}`);
      const applications = data

      setApplications(applications)
    } catch (error) {
      console.error("Failed to load applications:", error);
    }
  };
  useEffect(() => {
    setStates(Object.keys(statesAndDistricts));
    loadTenders();
    loadContractors();
    loadApplications();
    getUserDetails();
  }, []);

  
  const loadTenders = async () => {
    try {
      const { data } = await axios.get("https://tenders-server.onrender.com/home/api/tenders");
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
              <p>Client ID :  {userDetails.id}</p>
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
            <h2>Client Dashboard</h2>
            <div className='right-nav'>
            <ul>
              <li>Home</li>
              <li><a className="n-link" href="#mytenders">My Tenders</a></li>
              <li><a className="n-link" href="#applications">Applications</a></li>
              <li><a className="n-link" href="#contractors">Contractors</a></li>
              <li>Vendors</li>
            </ul>
            <button className='logbutton' onClick={handleLogout} > Logout </button>
            </div>
        </nav>

        <div className='client-dashboard'>
              <h1>Welcome, {role}</h1>

              <div className="top-body">
                  <ClientProfile key={userDetails.id} />
                  <div className='right'>
                    
                      <h3>Post a New Tender</h3>
                      <form className="newTenderForm" onSubmit={handleSubmit} encType="multipart/form-data">
                          <div className="row">
                                <div className="inputbox">
                                    <label htmlFor="phone_number">Phone Number:</label>
                                    <input id="phone_number" type="number" name="phone_number" value={form.phone_number} onChange={handleFormChange} required />
                                </div>
                                
                          </div>
                          
                          <div className="row">
                                  <div className="inputbox">
                                      <label htmlFor="area">Area:</label>
                                      <input id="area" type="text" name="area" value={form.area} onChange={handleFormChange} required />
                                  </div>
                                  <div className="inputbox">
                                      <label htmlFor="plinth_area">Plinth Area:</label>
                                      <input id="plinth_area" type="text" name="plinth_area" value={form.plinth_area} onChange={handleFormChange} required />
                                  </div>
                                  <div className="inputbox">
                                      <label htmlFor="name_of_work">Name of Work:</label>
                                      <input id="name_of_work" type="text" name="name_of_work" value={form.name_of_work} onChange={handleFormChange} required />
                                  </div>
                          </div>

                          <div className="row">
                                  <div className="inputbox nature">
                                      <label htmlFor="nature-of-work">Nature of Work:</label>
                                      <Select
                                          id = "nature-of-work"
                                          options={natureOfWorkOptions.map((work) => ({ value: work, label: work }))}
                                          value={natureOfWorkOptions.find((work) => work === form.nature_of_work)}
                                          onChange={(selected) => setForm({ ...form, nature_of_work: selected.value })}
                                          placeholder={natureOfWorkOptions.find((work) => work === form.nature_of_work)}
                                        />
                                  </div>
                                  <div className="inputbox">
                                      <label htmlFor="states">State:</label>
                                      <select id='states' name="state" value={form.state} onChange={(e) => handleStateChange(e.target.value)} required>
                                        <option value="" disabled>Select State</option>
                                            {states.map((state) => (
                                            <option key={state} value={state}>
                                              {state}
                                            </option>))}
                                      </select>     
                                  </div>
                                  <div className="inputbox">
                                      <label htmlFor="districts">District:</label>
                                      <select id='districts' name="district" value={form.district} onChange={handleFormChange} required>
                                        <option value="" disabled>Select District</option>
                                            {districts.map((district) => (
                                              <option key={district} value={district}>
                                                {district}
                                          </option>))}
                                      </select>
                                  </div>
                                  
                          </div>

                          <div className="row">
                                  <div className="inputbox">
                                      <label htmlFor="publishDate">Publish On:</label>
                                      <input id="publishDate" type="date" name="tender_published_on" value={form.tender_published_on} onChange={handleFormChange} required />
                                  </div>

                                  <div className="inputbox">
                                      <label>Response By:</label>
                                      <input type="date" name="tender_response_by" value={form.tender_response_by} onChange={handleFormChange} required />
                                  </div>
                          </div>

                          <div className="row">
                                <button className="submit" type="submit">Submit</button>
                          </div>
                      </form>
                  </div>
              <div/>
        </div>

        

        <div className="tenders-container">
      {/*new tenders //// Header with Filter Buttons */}
      <div className="tenders-header">
        <h2>Active Tenders</h2>
        <div className="filter-buttons">
          <button onClick={() => filterTenders("All")} className={`filter-button ${filterType === "All" ? "active" : ""}`}>All</button>
          <button onClick={() => filterTenders("Construction")} className={`filter-button ${filterType === "Construction" ? "active" : ""}`}>Construction</button>
          <button onClick={() => filterTenders("Material")} className={`filter-button ${filterType === "Material" ? "active" : ""}`}>Material</button>
        </div>
      </div>

      {/* Tenders Table */}
      <table className="tender-table">
        <thead>
          <tr>
            <th>Tender ID</th>
            <th>Tender Type</th>
            <th>Posted By</th>
            <th>Work Description</th>
            <th>Location</th>
            <th>Nature of Work</th>
            <th>Published On</th>
            <th>Response By</th>
            <th>BoQ</th>
          </tr>
        </thead>
        <tbody>
          {displayTenders.map((tender) => (
            <tr key={tender.tender_id}>
              <td>{tender.tender_id}</td>
              <td>{tender.tender_type}</td>
              <td>{tender.client_name}</td>
              <td>{tender.name_of_work}</td>
              <td>{tender.state}</td>
              <td>{tender.nature_of_work}</td>
              <td>{new Date(tender.tender_published_on).toLocaleDateString()}</td>
              <td>{new Date(tender.tender_response_by).toLocaleDateString()}</td>
              <td>
                <a className="download-btn" >Download</a>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="paginationCard">
                <button onClick={() => handlePageChange(-1)}>Previous</button>
                  <span>
                    Page {currentPage} of {Math.ceil(filteredTenders.length / itemsPerPage)}
                  </span>
                <button onClick={() => handlePageChange(1)}>Next</button>
            </div>


        </div>
        
        <div id="mytenders" className="tendersCard">
          <div>
            <h2>My Tenders</h2>
            <table>
              <thead className="my_tenders">
                <tr>
                  <th>Tender ID</th>
                  <th>Work Description</th>
                  <th>Location</th>
                  <th>Nature of Work</th>
                  <th>Tender Published On</th>
                  <th>Tender Response By</th>
                </tr>
              </thead>
              <tbody>
                {myTenders.map((tender) => (
                  <tr key={tender.id}>
                    <td>{tender.tender_id}</td>
                    <td>{tender.name_of_work}</td>
                    <td>{tender.state}</td>
                    <td>{tender.nature_of_work}</td>
                    <td>{new Date(tender.tender_published_on).toLocaleDateString()}</td>
                    <td>{new Date(tender.tender_response_by).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>



        <div id="applications" className="tendersCard">
          <div>
            <h2>Applications of my tenders</h2>
            <table>
              <thead>
                <tr>
                  <th>Tender ID</th>
                  <th>Tender Name</th>
                  <th>Tender Budget</th>
                  <th>Bid Amount</th>
                  <th>Contractor ID</th>
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
                    <td>{application.contractor_id}</td>
                    <td>{new Date(application.submitted_on).toLocaleDateString()}</td>
                    <td>{new Date(application.tender_deadline).toLocaleDateString()}</td>
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



          <div className="archive-icon" onClick={handleArchiveClick}>
            <i className="fas fa-archive"></i> Archive
          </div>

          
          <div className="content">
            

          </div>

        </div>

    </>
  );
};

export default ClientDashboard;