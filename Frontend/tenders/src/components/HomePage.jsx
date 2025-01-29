import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({
    name_of_work: "",
    client_id:"",
    area: "",
    plinth_area: "",
    state: "",
    district: "",
    place: "",
    nature_of_work: "",
    tender_published_on: "",
    tender_response_by: "",
    boq_file: null,
  });
  const [tenders, setTenders] = useState([]);
  const [archive, setArchive] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  
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

  useEffect(() => {
    setStates(Object.keys(statesAndDistricts));
    loadTenders();
  }, []);

  const handleStateChange = (selectedState) => {
    setForm({ ...form, state: selectedState });
    setDistricts(statesAndDistricts[selectedState] || []);
  };

  const handleFormChange = (e) => {
 
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
   
  };

  const handleFileChange = (e) => {
    setForm({ ...form, boq_file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      await axios.post("http://localhost:3001/dashboard/api/submit", formData);
      alert("Tender submitted successfully!");
      setForm({
        name_of_work: "",
        client_id:"",
        area: "",
        plinth_area: "",
        state: "",
        district: "",
        place: "",
        nature_of_work: "",
        tender_published_on: "",
        tender_response_by: "",
        boq_file: null,
      });
      loadTenders();
    } catch (error) {
      alert("Failed to submit tender.");
    }
  };

  const loadTenders = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/dashboard/api/tenders");
      const currentDate = new Date().toISOString().split("T")[0];
      const activeTenders = data.filter((tender) => tender.tender_response_by > currentDate);
      const archivedTenders = data.filter((tender) => tender.tender_response_by <= currentDate);
      setTenders(activeTenders);
      setArchive(archivedTenders);
    } catch (error) {
      console.error("Failed to load tenders:", error);
    }
  };

  const filteredTenders = tenders.filter((tender) =>
    [tender.id, tender.name_of_work, tender.state, tender.district, tender.place, tender.nature_of_work]
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
    navigate("/archive");
  };


  return (
    <div className="home">
      <h1 className="tendersHeading">Tenders page</h1>
      <div className="topArea">
        <div  className="left-sidebar">
      <h3>Blogs</h3>
      <marquee direction="up" className="blogs">
      
      <div className="blog-card">
        <h4>How to Bid Successfully</h4>
        <p>Learn the secrets to winning your next tender.</p>
      </div>
      <div className="blog-card">
        <h4>Understanding BOQ</h4>
        <p>A guide to mastering Bill of Quantities.</p>
      </div>
      <div className="blog-card">
        <h4>Top 10 Tendering Tips</h4>
        <p>Boost your chances with these essential tips.</p>
      </div>
      <div className="blog-card">
        <h4>Common Mistakes in Bidding</h4>
        <p>Avoid these pitfalls to stay ahead in the competition.</p>
      </div>
      <div className="blog-card">
        <h4>Understanding BOQ</h4>
        <p>A guide to mastering Bill of Quantities.</p>
      </div>
      <div className="blog-card">
        <h4>Top 10 Tendering Tips</h4>
        <p>Boost your chances with these essential tips.</p>
      </div>
      <div className="blog-card">
        <h4>Common Mistakes in Bidding</h4>
        <p>Avoid these pitfalls to stay ahead in the competition.</p>
      </div>
      </marquee>
      </div>


      <form className="newTenderForm" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
              <div className="inputbox">
                  <label htmlFor="client_id">Client Id:</label>
                  <input id="client_id" type="text" name="client_id" value={form.client_id} onChange={handleFormChange} required />
              </div>
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

              <div className="inputbox">
                  <label>BoQ File:</label>
                  <input type="file" name="boq_file" onChange={handleFileChange} />
              </div>
       </div>
       <div className="row">
            <button className="submit" type="submit">Submit</button>
       </div>
    </form>
    
    <div>
    <div className="r-card">
    {/* client registraion button */  }
        <button className="animated-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="arr-2" viewBox="0 0 24 24">
            <path
              d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            ></path>
          </svg>
          <span class="text">Client Registration</span>
          <span class="circle"></span>
          <svg xmlns="http://www.w3.org/2000/svg" class="arr-1" viewBox="0 0 24 24">
            <path
              d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            ></path>
          </svg>
        </button>
        <p>Register as a client to submit your tender.</p>
      </div>
      <div className="r-card">
      <button className="animated-button animated-button2">
          <svg xmlns="http://www.w3.org/2000/svg" class="arr-2" viewBox="0 0 24 24">
            <path
              d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            ></path>
          </svg>
          <span className="text">Contractor Registration</span>
          <span className="circle"></span>
          <svg xmlns="http://www.w3.org/2000/svg" class="arr-1" viewBox="0 0 24 24">
            <path
              d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            ></path>
          </svg>
        </button>
        <p>Register as a contractor to bid construction tenders professionally</p>
      </div>
      <div className="r-card">
      <button className="animated-button animated-button3">
          <svg xmlns="http://www.w3.org/2000/svg" class="arr-2" viewBox="0 0 24 24">
            <path
              d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            ></path>
          </svg>
          <span className="text">Vendor Registration</span>
          <span className="circle"></span>
          <svg xmlns="http://www.w3.org/2000/svg" class="arr-1" viewBox="0 0 24 24">
            <path
              d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            ></path>
          </svg>
        </button>
        <p>Register as a vendor for material tenders and opportunities.</p>
      </div>
    </div>

      </div>

      <h2>Active Tenders</h2>
      <input
        type="text"
        placeholder="Search by Tender ID, Name of Work, State, District, Place, or Nature of Work"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Tender ID</th>
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
            <tr key={tender.id}>
              <td>{tender.id}</td>
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
                <button onClick={() => handleApply(tender.id)}>Apply</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => handlePageChange(-1)}>Previous</button>
        <span>
          Page {currentPage} of {Math.ceil(filteredTenders.length / itemsPerPage)}
        </span>
        <button onClick={() => handlePageChange(1)}>Next</button>
      </div>
      <div className="archive-icon" onClick={handleArchiveClick}>
        <i className="fas fa-archive"></i> Archive
      </div>
    </div>
  );
};

export default HomePage;
