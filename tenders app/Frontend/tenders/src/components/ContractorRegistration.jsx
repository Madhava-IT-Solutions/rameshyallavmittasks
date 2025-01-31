import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ContractorRegistration.css';

const ContractorRegistration = () => {
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
    const navigate = useNavigate();




  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    license_number:'',
    password: '',
    confirm_password: '',
    state: '',
    district: '',
   
    name_of_firm:'',
    license_type:"",
    interests:[]
  });


  

  const syncInterestsWithFormData = (updatedInterests) => {
    setInterests(updatedInterests);
    setFormData((prevFormData) => ({
      ...prevFormData,
      interests: updatedInterests
    }));
  };

  const handleAddInterest = () => {
    if (interestInput.trim()) {
      const updatedInterests = [...interests, interestInput.trim()];
      syncInterestsWithFormData(updatedInterests);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (index) => {
    const updatedInterests = interests.filter((_, i) => i !== index);
    syncInterestsWithFormData(updatedInterests);
  };


  const handleInterestsChange = () => interests.join(",");



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    if (name === 'confirm_password') {
      if (formData.password && formData.password !== value) {
        setError('Passwords do not match!');
      } else {
        setError('');
      }
    }

    if (name === 'password' && formData.confirm_password) {
      if (value !== formData.confirm_password) {
        setError('Passwords do not match!');
      } else {
        setError('');
      }
    }
  
  
  
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
    const handleSubmit = async (e) => {

      e.preventDefault();
      
    
      console.log(formData)
      if (formData.password !== formData.confirm_password) {
        setError('Passwords do not match!');
        return;
      }
  
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => data.append(key, item)); // Handle arrays
        } else {
          data.append(key, value);
        }
      });
       
     
      if (file) data.append('file', file);
  
      try {
        const response = await axios.post(
          'https://tenders-server.onrender.com/registrations/api/register-contractor',
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        alert(response.data.message);
        navigate('/success');
      } catch (err) {
        console.error('Error:', err);
        alert(err.response?.data?.error || 'Registration failed.');
      }
    };




 

  return (
    <>
      <div className="cobg">
        <marquee className="vmarkq">Contractor Registration</marquee>
        <div className="comain">
          <div className="coimg">
            <p className="copara">Welcome Contractor</p>
            <img
              src="https://cdn.pixabay.com/photo/2017/10/05/14/43/register-2819608_960_720.jpg"
              className="cim"
              alt="Registration Banner"
            />
          </div>
          <form onSubmit={handleSubmit} className="contForm" action="/submit" method="POST" encType="multipart/form-data">
            <div className="contbg">
              <div className="cocard1">
                <label className="vlabel" htmlFor="username">Username:</label>
                <input value={formData.username}    onChange={handleChange} className="vnp" type="text" id="username" name="username"     placeholder="Enter Username.." required />
                <br />
                <br />
                <label className="vlabel" htmlFor="email">Email:</label>
                <input value={formData.email}    onChange={handleChange}  className="vnp" type="email" id="email" name="email"     placeholder="Enter Email.." required />
                <br />
                <label className="vlabel" htmlFor="phone">Mobile Number:</label>
                <input  value={formData.phone}   onChange={handleChange}  className="vnp" type="text" id="phone" name="phone"     placeholder="Enter Mobile number.." required />
                <br />
                <br />
                  
                <label className="vlabel" htmlFor="license_number">License Number:</label>
                <input  value={formData.license_number}   onChange={handleChange}  className="vnp" type="text" id="license_number" name="license_number"     placeholder="Enter Liscence Number.." required />
                <br />
                <br />
              
              </div>
              <div className="cocard1">

              <label className="vlabel" htmlFor="name_of_firm">Name of Firm:</label>
                <input value={formData.name_of_firm}   onChange={handleChange} className="vnp" type="text" id="name_of_firm"     placeholder="Enter Name of Firm.." name="name_of_firm" required />
                <br />
                <br />
             
                <label className="vlabel" htmlFor="license_type">Type of License:</label>
                <select  value={formData.license_type}   onChange={handleChange}  className="vnp" id="license_type" name="license_type" required>
                  <option value="">Select Type of License</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                  <option value="V">V</option>
                  <option value="I(A)">I(A)</option>
                  <option value="Class A">Class A</option>
                  <option value="Class B">Class B</option>
                  <option value="Class C">Class C</option>
                  <option value="Class D">Class D</option>
                </select>
                <br />
                <br />

                <label className="vlabel" htmlFor="state">State:</label>
          <select value={formData.state}    onChange={handleChange}  className="vnp" id="state" name="state" required>
            <option value="">Select State</option>
            <option value="State1">State1</option>
            <option value="State2">State2</option>
          </select>
          <br />
                <label className="vlabel" htmlFor="district">District:</label>
                <select value={formData.district}    onChange={handleChange}  className="vnp" id="district" name="district" required>
                  <option value="">Select District</option>
                  <option value="District1">District1</option>
                  <option value="District2">District2</option>
                </select>
                <br />
              </div>
              <div className="cocard1">

             
                <br />

                <label className="vlabel" htmlFor="password">Password:</label>
                <input
                 className="vnp"
                  type="password"
                  id="password"
                  name="password"
                      placeholder="Enter Password.."
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <br />
                <label className="vlabel" htmlFor="confirm_password">Confirm Password:</label>
                <input
                 className="vnp"
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
            onChange={handleChange}
                placeholder="Enter Confirm Password.."
                  required
                />
                {error && <p className="error">{error}</p>}
                <br />
               
                <label className="vlabel" htmlFor="license_file">Upload License (PDF):</label>
                <input    onChange={handleFileChange}  type="file" id="license_file" name="license_file" required />
                <br />
                <div>
                  <label className="vlabel" htmlFor="area_of_interest">Area of Interest:</label>
                  <div className="cocontainer2">
                    <input
                     className="vnp"
                      type="text"
                      id="interest_input"
                      
                      placeholder="Enter a skill or interest"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                    />
                    <button className="cobut" type="button" onClick={handleAddInterest}>
                      Add
                    </button>
                  </div>
                  <div className="cocontainer">
                    {interests.map((interest, index) => (
                      <span className="oo" key={index}>
                        {interest}{" "}
                        <button
                          className="coadd"
                          type="button"
                          onClick={() => handleRemoveInterest(index)}
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                   className="vnp"
                    type="hidden"
                    id="interests"
                    name="interests"
                    value={handleInterestsChange()}
                  />
                </div>
              </div>
            </div>
            <div className="colabel">
              <label>
                <input type="checkbox" name="consent" required />
                I hereby convey my consent to register my firm with SSV Constructions.
              </label>
              <br />
              <br />
            </div>
            <div className="cobtn">
              <button className="cont_register" type="submit" >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContractorRegistration;