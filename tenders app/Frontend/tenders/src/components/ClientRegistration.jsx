import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ClientRegistration.css';

const ClientRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    organisationName: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
    place: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Password validation
    if (name === 'confirmPassword') {
      if (formData.password && formData.password !== value) {
        setError('Passwords do not match!');
      } else {
        setError('');
      }
    }

    if (name === 'password' && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setError('Passwords do not match!');
      } else {
        setError('');
      }
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append('file', file);

    try {
      const response = await axios.post(
        'https://tenders-server.onrender.com/registrations/api/register-client',
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
      <div className="cbg">
        <marquee className="markq">Client Registration</marquee>
        <div className="ctitle">
          <div className='client_welcome'>

           <p className='copara'>Welcome Client</p>
           <img src='https://cdn.pixabay.com/photo/2015/07/11/19/28/woman-841173_1280.jpg'  className='client_img'/>
          </div>
          <form className="cform" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="card">
              <div className='client_car'>
                <div className="form-group">
                  <label className="clabel" htmlFor="UserName">Username</label>
                  <input
                    className="inp"
                    type="text"
                    id="UserName"
                    name="username"
                    placeholder="Enter Username.."
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="clabel" htmlFor="Email">Email</label>
                  <input
                    className="inp"
                    type="email"
                    id="Email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="clabel" htmlFor="mobile">Mobile</label>
                  <input
                    className="inp"
                    type="text"
                    id="mobile"
                    name="mobile"
                    placeholder="Enter Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="form-group">
                  <label className="clabel" htmlFor="Password">Password</label>
                  <input
                    className="inp"
                    type="password"
                    id="Password"
                    name="password"
                    placeholder="Enter password."
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="clabel" htmlFor="ConfirmPassword">Confirm Password</label>
                  <input
                    className="inp"
                    type="password"
                    id="ConfirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password."
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
              
                  {error && <p className="error">{error}</p>}
                
                </div>
               
              </div>
              <div>
              <div className="form-group">
                  <label className="clabel" htmlFor="organisationName">Organisation Name</label>
                  <input
                    className="inp"
                    type="text"
                    id="organisationName"
                    name="organisationName"
                    placeholder="Enter Organisation Name"
                    value={formData.organisationName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="clabel" htmlFor="state">State</label>
                  <input
                    className="inp"
                    type="text"
                    id="state"
                    name="state"
                    placeholder="Enter State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="clabel" htmlFor="district">District</label>
                  <input
                    className="inp"
                    type="text"
                    id="district"
                    name="district"
                    placeholder="Enter District"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="clabel" htmlFor="place">Place</label>
                  <input
                    className="inp"
                    type="text"
                    id="place"
                    name="place"
                    placeholder="Enter Place"
                    value={formData.place}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="file">Upload BOQ File</label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleFileChange}
                  />
                </div>
               
              </div>
            </div>
            <div className="cgroup ">
              <input type="checkbox" id="consent" name="consent" required />
              <label htmlFor="consent">I agree to the terms and conditions</label>
            </div>
            <div className="but">
              <button className="cb" type="submit">Register Client</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ClientRegistration;