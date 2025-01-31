import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VendorRegistration.css'

const VendorRegistration = () => {
  const navigate = useNavigate()

    const [file, setFile] = useState(null);
    const [error, setError] = useState('');


    const [formData, setFormData] = useState({
      username: '',
      email: '',
      phone: '',
      experience:'',
      password: '',
      confirm_password: '',
      state: '',
      district: '',
     
      firm_name:'',
      gst_number:"",
      materials:''
    });




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
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (file) data.append('file', file);
  
      try {
        const response = await axios.post(
          'https://tenders-server.onrender.com/registrations/api/register-vendor',
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        alert(response.data.message);
        navigate('/login');
      } catch (err) {
        console.error('Error:', err);
        alert(err.response?.data?.error || 'Registration failed.');
      }
    };



  return (
    <div className="vmain">
        <marquee className="vendor_markq">Vendor Registration</marquee>
    <div className="vtitle">
        <div className="vimg">
            <p className="vpara">Welcome Vendor</p>
<img src="https://cdn.pixabay.com/photo/2019/10/02/04/40/registration-4519979_1280.jpg"   className="vim"
              alt="Registration Banner2" />
        </div>
    <form className="vform" action="/submit-vendor" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="vbg">
        <div className="vcard1">
          <label className="vendorla"  htmlFor="username">Username:</label>
          <input value={formData.username}    onChange={handleChange} className="vendorlabel" type="text" id="username" name="username"   placeholder="Enter Username.." required />
          <br />
          <br />

          <label className="vendorla" htmlFor="firm_name">Name of Firm:</label>
          <input value={formData.firm_name}   onChange={handleChange} className="vendorlabel" type="text" id="firm_name" name="firm_name"   placeholder="Enter Firm NAme.." required />
          <br />
          <br />

          <label className="vendorla" htmlFor="gst_number">GST Number:</label>
          <input value={formData.gst_number}    onChange={handleChange} className="vendorlabel" type="text" id="gst_number" name="gst_number"   placeholder="Enter gst number.." required />
          <br />
          <br />

          <label className="vendorla" htmlFor="email">Email:</label>
          <input value={formData.email}    onChange={handleChange} className="vendorlabel" type="email" id="email" name="email"   placeholder="Enter email.." required />
          <br />
          <br />

         
        </div>

        <div className="vcard1">

        <label className="vendorla" htmlFor="phone">Mobile Number:</label>
          <input value={formData.phone}   onChange={handleChange} className="vendorlabel" type="tel" id="phone" name="phone"   placeholder="Enter mobile number.." required />
          <br />
          <br />


          <label className="vendorla" htmlFor="experience">Years of Experience:</label>
          <input value={formData.experience}   onChange={handleChange} className="vendorlabel" type="number" id="experience" name="experience"   placeholder="Enter experience.." required />
          <br />
          <br />


          <label className="vendorla" htmlFor="state">State:</label>
          <select value={formData.state}    onChange={handleChange} className="vendorlabel" id="state" name="state" required>
            <option value="">Select State</option>
            <option value="State1">State1</option>
            <option value="State2">State2</option>
          </select>
          <br />
          <br />

          <label className="vendorla" htmlFor="district">District:</label>
          <select    onChange={handleChange} value={formData.district} className="vendorlabel" id="district" name="district" required>
            <option value="">Select District</option>
            <option value="District1">District1</option>
            <option value="District2">District2</option>
          </select>
          <br />
          <br />

         

         
        </div>

        <div className="vcard2">
        

         

        

          <label className="vendorla" htmlFor="password">Password:</label>
          <input className="vendorlabel"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
              placeholder="Enter password.."
            required
          />
          <br />
          <br />

          <label className="vendorla" htmlFor="confirm_password">Confirm Password:</label>
          <input className="vendorlabel"
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
              placeholder="Enter confirm password.."
            required
          />
                {error && <p className="error">{error}</p>}
          <br />
          <br />

          <label className="vendorla" htmlFor="gst_certificate">Upload GST Certificate (PDF):</label>
          <input 
            type="file"
            id="gst_certificate"
            name="gst_certificate"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
          <br />
          <br />

          <label className="vendorla" htmlFor="materials">Material for Supply:</label>
          <select className="vendorlabel"
            id="materials"
            name="materials"
            required
            value={formData.materials}
            onChange={handleChange}
          >
            <option value="">Select Material</option>
            <option value="cement">Cement</option>
            <option value="steel">Steel</option>
            <option value="sand">Sand</option>
            <option value="aggregate">Aggregate</option>
            <option value="bricks">Bricks</option>
            <option value="tiles">Tiles</option>
            <option value="wood">Wood</option>
            <option value="plastic_pipes">Plastic Pipes</option>
            <option value="plumbing_ware">Plumbing Ware</option>
            <option value="centenary_ware">Centenary Ware</option>
            <option value="gi_pipes">GI Pipes</option>
            <option value="upvc_windows">UPVC Windows</option>
          </select>
          <br />
        
          <br />
        </div>
      </div>

      <div className="colabel">
        <label>
          <input  type="checkbox" name="consent" required />
          I hereby convey my consent to register my firm with SSV Constructions.
        </label>
        <br />
        <br />
      </div>

      <div className="cobtn">
        <button className="vregister" type="submit" >
          Register
        </button>
      </div>
    </form>
    </div>
    </div>
  );
};

export default VendorRegistration;