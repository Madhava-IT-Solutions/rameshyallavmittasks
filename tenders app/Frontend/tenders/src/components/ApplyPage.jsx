import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams ,useNavigate} from "react-router-dom";

import "./Apply.css";

const ApplyPage = () => {
  const navigate = useNavigate();
  
  
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    license_no: "",
    license_type: "",
    bid_amount:"",  
    mobile: "",
    email: "",
  });

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
  // Generate random CAPTCHA
  const generateCaptcha = () => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let generatedCaptcha = "";
    for (let i = 0; i < 6; i++) {
      generatedCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(generatedCaptcha);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCaptchaChange = (e) => {
    setCaptchaInput(e.target.value);
  };

  const { tenderid } = useParams(); // Get tender ID from URL


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (captchaInput !== captcha) {
      alert("Incorrect CAPTCHA. Please try again.");
      generateCaptcha(); // Regenerate CAPTCHA for retry
      return;
    }

    
    const user_id = userDetails.id.toString(); 
    // Create form data for submission
    const data = new FormData();
    
    
    data.append("tender_id", tenderid);
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    data.set("user_id", user_id);
   
    // Debugging output
    const jsonObject = {};
    data.forEach((value, key) => {
      jsonObject[key] = value;
    });
    console.log(jsonObject);

    try {
      const response = await axios.post("https://tenders-server.onrender.com/apply/api/apply-tender", data
      );
      console.log(response)

      alert(response.data.message);
      navigate('/dashboard');

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };


  return (
  
    <div className="apply-bg">
      <h1>Tender Application Form</h1>
      <form className="apply-page"  onSubmit={handleFormSubmit}>
     
      

        {/* Add other form fields similarly */}
<div className="apply-form">
        <div>
          <label>Name:</label>
          <input
           className="apply_vendorlabel"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Mobile:</label>
          <input
             className="apply_vendorlabel"
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            required
          />
    
        </div>
        <div>
          <label>Email:</label>
          <input
             className="apply_vendorlabel"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
            
        </div>
 
        
        <div>
          <label>License No:</label>
          <input
             className="apply_vendorlabel"
            type="text"
            name="license_no"
            value={formData.license_no}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>License Type:</label>
          <select
             className="apply_vendorlabel"
            name="license_type"
            value={formData.license_type}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled selected>
              Select License Type
            </option>
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
        </div>


        <div>
          <label>Bid_amount:</label>
          <input
             className="apply_vendorlabel"
            type="text"
            name="bid_amount"
            value={formData.bid_amount}
            onChange={handleInputChange}
            required
          />
        </div>

       </div>



       

        {/* CAPTCHA Section */}
        <div className="apply-ca">
          <label className="apply_vendorla" >
            CAPTCHA: <span className="apply-captcha">{captcha}</span>
          </label>
          <input
            type="text"
            id="captchaInput"
            value={captchaInput}
            onChange={handleCaptchaChange}
            required
            placeholder="Enter CAPTCHA"
            className="apply-inp"
          />
          <button className="vendorcon" type="button" onClick={generateCaptcha}>
            Refresh CAPTCHA
          </button>
        </div>

        <div>
          <button className="apply-button" type="submit" value="Submit" >Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ApplyPage;