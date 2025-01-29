// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       navigate('/dashboard');
//     }
//   }, [navigate]);

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:3001/login/api/login', { username, password });
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('userDetails',JSON.stringify(res.data.userProfile))
//       window.location.href = '/dashboard';
//     } catch (err) {
//       alert('Invalid credentials');
//     }
//   };



//    const clientProfile = {
//     name: 'Client Company',
//     email: 'client@example.com',
//     location: 'Kakinada, Andhra Pradesh',
//   };


//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [form, setForm] = useState({
//     name_of_work: "",
//     area: "",
//     plinth_area: "",
//     state: "",
//     district: "",
//     place: "",
//     nature_of_work: "",
//     tender_published_on: "",
//     tender_response_by: "",
//     boq_file: null,
//   });
//   const [tenders, setTenders] = useState([]);
//   const [activeTenders,setactiveTenders] = useState([])
//   const [archive, setArchive] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 10;
  
//   const statesAndDistricts = {
//     "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari"],
//     "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng"],
//     Assam: ["Barpeta", "Bongaigaon", "Cachar"],
//     Bihar: ["Araria", "Aurangabad", "Banka"],
//   };

//   useEffect(() => {
//     setStates(Object.keys(statesAndDistricts));
//     loadTenders();
//   }, []);



//   const loadTenders = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:3001/home/api/tenders");
//       const currentDate = new Date().toISOString().split("T")[0];
//       const activeTenders = data.filter((tender) => tender.tender_response_by > currentDate);
//       const archivedTenders = data.filter((tender) => tender.tender_response_by <= currentDate);
//       setactiveTenders(activeTenders);
//       setArchive(archivedTenders);
//       console.log(data)
      
//     } catch (error) {
//       console.error("Failed to load tenders:", error);
//     }
//   };

//   const filteredTenders = activeTenders.filter((tender) =>
//     [ tender.name_of_work, tender.state, tender.district, tender.place, tender.nature_of_work]
//       .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const displayTenders = filteredTenders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (direction) => {
//     const totalPages = Math.ceil(filteredTenders.length / itemsPerPage);
//     if (currentPage + direction > 0 && currentPage + direction <= totalPages) {
//       setCurrentPage(currentPage + direction);
//     }
//   };
  

//   return (
//     <>

// <div>
      
//       <div className="App">
//          <header className="App-header">
//            <nav className="navbar">
//              <div className="container">
//                   <img src='https://ssvconstructions.in/wp-content/uploads/2024/05/cropped-ssv-final-logo-transparent-png-186x86.png' className='imag' />
//                   <h1 className="logo headings">Tenders</h1>
//                   <ul className="nav-links">
//                       <li><a href="#registrations">Registration</a></li>
//                       <li><a href="#tender-details">Tender Details</a></li>
//                       <li><a href="#contact">Contact</a></li>
//                   </ul>
//              </div>
//            </nav>
//          </header>
         
//          <section className="hero" >
//                 <div className="containers">
//                   <h1 className='main'>Welcome to Tenders </h1>
//                   <p className='para2'>Your gateway to innovative business opportunities and tender solutions.</p>
//                   <p>
//                       The one-stop platform for all your tender needs. Whether you are a client,
//                       contractor, or vendor, find all solutions tailored to your requirements.
//                   </p>
//                   <button className="cta">Explore Tenders</button>
//                 </div>
//                 <div className='log form-container'>
//                     <h2>Login to the Tenders App</h2>
//                     <p>Login if you are an existing user.</p>
//                     <form className="login-form" onSubmit={handleLogin}>
//                         <div className="input-container">
//                           <label htmlFor="username">Username</label>
//                           <input
//                             type="text"
//                             id="username"
//                             name="username"
//                             placeholder="Enter your username"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             suggested= "current-password"
//                             required
//                           />
//                         </div>
//                         <div className="input-container">
//                           <label htmlFor="password">Password</label>
//                           <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             placeholder="Enter your password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                           />
//                         </div>
//                         <button type="submit">Login</button>
//                         <div className="links">
//                           <a href="#" className="forgot-password">
//                             Forgot Password?
//                           </a>
//                           <span> | </span>
//                           <a href="#registrations" className="register">
//                             New user? Register here
//                           </a>
//                         </div>
//                     </form>
           
//                 </div>
                
               
//          </section>



//          <section  className='tendersCard'>
//                     <div>
//                         <h2>Active Tenders</h2>
//                         <table>
//                           <thead>
//                             <tr>
//                               <th>Tender ID</th>
//                               <th>Tender Posted By</th>
//                               <th>Work Description</th>
//                               <th>Location</th>
//                               <th>Nature of Work</th>
//                               <th>Published On</th>
//                               <th>Deadline</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {displayTenders.map((tender) => (
//                               <tr key={tender.tender_id}>
//                                 <td>{tender.tender_id}</td>
//                                 <td>{tender.client_name}</td>
//                                 <td>{tender.name_of_work}</td>
//                                 <td>{tender.state}</td>
//                                 <td>{tender.nature_of_work}</td>
//                                 <td>{tender.tender_published_on}</td>
//                                 <td>{tender.tender_response_by}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                     </div>

//                     <div className='paginationCard'>
//                       <button onClick={() => handlePageChange(-1)}>Previous</button>
//                       <span>
//                         Page {currentPage} of {Math.ceil(filteredTenders.length / itemsPerPage)}
//                       </span>
//                       <button onClick={() => handlePageChange(1)}>Next</button>
//                     </div>

//               </section>



         
   
   
//          <section id="registrations" className="business-ideas">
//            <div className="container">
//              <h2 className='process'>Registration Process</h2>
//              <p className='para'>Register here as Client to upload Tenders && Register as Contractor,Vendor to Apply Tenders</p>
//              <div  className="idea-list">
//                <div  className="idea-item">
//                  <h3 className='head'>CLIENT REGISTRATION</h3>
//                  <p className='mark'>Register as a Client to upload tenders.</p>
//                  <button type="button" className='reg'>Register</button>
//                </div>
//                <div className="idea-item">
//                  <h3 className='head'>CONTRACTOR REGISTRATION</h3>
                 
//                <p className="mark">Register as a Contractor to Apply tenders regarding construction works.</p>
//                <button type="button" className='reg'>Register</button>
//                </div>
//                <div className="idea-item">
//                  <h3 className='head'>VENDOR REGISTRATION</h3>
//                  <p className="mark">Register as a Vendor to Apply tenders related to supply of materials category</p>
//                  <button type="button" className='reg'>Register</button>
//                </div>
//              </div>
//            </div>
//          </section>
   
//          <section id="tender-details" className="tender-details">
//            <div className="container">
//              <h2 className='process'>Tender Details</h2>
//              <p className='para'>Access comprehensive information about ongoing and upcoming tenders, including deadlines, requirements, and benefits.</p>
//              <div className="tender-list">
//                <div className="tender-item">
//                  <h3 className='heads'>Tenders</h3>
//                  <marquee direction="up" className="det">
//                 Open Tenders
//                <br/>
//                Single-stage Tenders
//                 <br/>
//                 Negotiated Tenders
//               <br/>
//               Selective Tenders
//                 <br/>
//                 Two-stage selective Tenders
//                <br/>
//                Dynamic Purchasing System (DPS)
           
//                  </marquee>
//                </div>
//                <div className="tender-item">
//                  <h3 className='heads'>Construction Works</h3>
//                  <marquee direction="up" className="det">
//                  Residential construction
//                <br/>
//                  Commercial construction
//                 <br/>
//                  Industrial construction
//               <br/>
//                  Infrastructure construction
//                 <br/>
//                  Institutional construction
//                <br/>
//                  Mixed-use construction
//             <br/>
//                  Heavy civil construction
//                  </marquee>
   
//                </div>
//                <div className="tender-item">
//                  <h3 className='heads'>Supply of Materials</h3>
   
//                  <marquee direction="up" className="det">
//                Raw Materials like Cement,Iron,Sand
//                <br/>
//                Forecasting and planning
//                 <br/>
//                 Supplier sourcing
//               <br/>
//               Request for quotation (RFQ)
//                 <br/>
//                 Contract negotiation
//                <br/>
//                Purchase order and approval
//             <br/>
//             Inventory management
//                  </marquee>
               
//                </div>
//              </div>
//            </div>

//            <div>
//         <h2>Features</h2>
//         <ul>
//           <li>Post tenders and manage projects seamlessly.</li>
//           <li>Browse and bid on tenders efficiently.</li>
//           <li>Showcase your products and manage supply requests.</li>
//         </ul>
//         </div>

//            <div className="testimonials">
//           <h3>What Our Users Say</h3>
//           <p>"This platform has transformed how we manage our tenders!"</p>
//           <p>"As a contractor, I appreciate the real-time updates!"</p>
//         </div>
       
//          </section>
   
//          <section id="contact" className="contact">
//            <div className="container">
//              <h2>Contact Us</h2>
//              <form>
//                <div className="form-group">
//                  <label htmlFor="name">Name</label>
//                  <input type="text" id="name" placeholder="Your Name" />
//                </div>
//                <div className="form-group">
//                  <label htmlFor="email">Email</label>
//                  <input type="email" id="email" placeholder="Your Email" />
//                </div>
//                <div className="form-group">
//                  <label htmlFor="message">Message</label>
//                  <textarea id="message" placeholder="Your Message"></textarea>
//                </div>
//                <button type="submit" className="btn">Submit</button>
//              </form>
//            </div>
//          </section>
   
//          <footer className="footer">
//            <div className="container">
//              <p>&copy; 2025 @ssvconstructions. All rights reserved.</p>
//            </div>
//          </footer>
//        </div>
         
//        </div>


    
    
//  </>



//   );
// };

// export default Login;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const loadTenders = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/home/api/tenders");
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
    [ tender.name_of_work, tender.state, tender.district, tender.place, tender.nature_of_work]
      .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayTenders = filteredTenders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    loadTenders();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login/api/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userDetails',JSON.stringify(res.data.userProfile))
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Invalid credentials');
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmitcontact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login/api/send", formData);
      alert(response.data.message);
      setFormData({
        name: "",
        email: "",
        message: ""
    });
    
    } catch (error) {
      alert("Error sending message. Try again later.");
    }
  };

  const handleClient = async (event) =>{
    event.preventDefault();
    navigate('/ClientRegistration')
  }
  
  const handleContractor = async (event) =>{
    event.preventDefault();
    navigate('/ContractorRegistration')
  }
  
  const handleVendor = async (event) =>{
    event.preventDefault();
    navigate('/VendorRegistration')
  }

  return (
    <>
      <div className="Login-page">
         <header className="App-header">
           <nav className="navbar">
              <a href='https://ssvconstructions.in/' target='blank'><img src='https://ssvconstructions.in/wp-content/uploads/2024/05/cropped-ssv-final-logo-transparent-png-186x86.png' className='imag' /></a>
               <h1 className="logo headings">Tenders</h1>
               <ul className="nav-links">
                 <li><a href="#business-ideas">Registration</a></li>
                 <li><a href="#tender-details">Tender Details</a></li>
                 <li><a href='#tenders_table'>Active Tenders</a></li>
                 <li><a href="#contact">Contact</a></li>
               </ul>
           </nav>
         </header>
         
         <section className="home">
           <div>
             <h1>Welcome to Tenders </h1>
             <p className='welcome-para'>Your gateway to innovative business opportunities and tender solutions.</p>
             <p className='welcome-para'>The one-stop platform for all your tender needs. Whether you are a client, contractor, or vendor, find all solutions tailored to your requirements.</p>
             <button  className="explore-btn"><a className='bclor' href="#tenders_table" >Explore Tenders</a></button>
           </div>
           <div className='log form-container'>
               <h2 className='main'>Login to the Tenders </h2>
               <p className='para2'>Login if you are an existing user.</p>
               <form className="login-form" onSubmit={handleLogin}>
                  <div className="input-container">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        className='user'
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        suggested= "current-password"
                        required/>
                  </div>
                  <div className="input-container">
                    <label htmlFor="password">Password</label>
                    <input className='user'
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required/>
                  </div>
                  <button type="submit">Login</button>
                  <div className="links">
                    <a href="#" className="forgot-password"> Forgot Password?</a>
                    <span> | </span>
                    <a href="#business-ideas" className="register">New user? ple Register here</a>
                  </div>
               </form>
           </div>
         </section>

        <section id="tenders_table"  className='tendersCard3'>
                    <div className='tendersCard2 subject animation '>
                        <h2 className='lpara'>Active Tenders</h2>
                      
                      
                          <div  >
                          
                            <div   >
                                  <table>
                                
                                        <thead >
                                          <tr  className=' thead '>
                                            <th>Tender ID</th>
                                            <th>Tender Posted By</th>
                                            <th>Work Description</th>
                                            <th>Location</th>
                                            <th>Nature of Work</th>
                                            <th>Published On</th>
                                            <th>Deadline</th>
                                            
                                          </tr>
                                        </thead>
                                        <marquee direction="up" scrolldelay="30" onmouseover="this.stop();" onmouseout="this.start();">
                                            <tbody  >
                                              {displayTenders.map((tender) => (

                                                <tr className='thead mq  ten_scroll'  key={tender.tender_id}>
                                                  <td >{tender.tender_id}</td>
                                                  <td >{tender.client_name}</td>
                                                  <td>{tender.name_of_work}</td>
                                                  <td>{tender.state}</td>
                                                  <td>{tender.nature_of_work}</td>
                                                  <td>{tender.tender_published_on}</td>
                                                  <td>{tender.tender_response_by}</td>
                                                </tr>
                                        
                                              ))}
                                            </tbody>
                                                    </marquee>
                                  </table>
                          
                            
                          </div>

                          </div>

                        
                        </div>


                      
                  


        </section>
   
   
         <section id="business-ideas" className="business-ideas">
           <div className="container">
             <h2 className='process'>Registration Process</h2>
             <p className='para'>Register here as Client to upload Tenders && Register as Contractor,Vendor to Apply Tenders</p>
             <div className="idea-list">
               <div  className="idea-item1">
                 <h3 className='head'>CLIENT REGISTRATION</h3>
                 <p className='mark'>Register as a Client to upload tenders.</p>
                 <button  onClick={handleClient} type="button" className='reg'>Register</button>
               </div>
               <div className="idea-item2">
                 <h3 className='head'>CONTRACTOR REGISTRATION</h3>
                 
               <p className="mark">Register as a Contractor to Apply tenders regarding construction works.</p>
               <button  onClick={handleContractor} type="button" className='reg'>Register</button>
               </div>
               <div className="idea-item3">
                 <h3 className='head'>VENDOR REGISTRATION</h3>
                 <p className="mark">Register as a Vendor to Apply tenders related to supply of materials category</p>
                 <button  onClick={handleVendor} type="button" className='reg'>Register</button>
               </div>
             </div>
           </div>
         </section>
   
         <section id="tender-details" className="tender-details">
           <div className="container">
             <h2 className='process'>Tender Details</h2>
             <p className='para'>Access comprehensive information about ongoing and upcoming tenders, including deadlines, requirements, and benefits.</p>
             <div className="tender-list">
               <div className="tender-item">
                 <h3 className='heads'>Tenders</h3>
                 <marquee direction="up" className="det">
                Open Tenders
               <br/>
               Single-stage Tenders
                <br/>
                Negotiated Tenders
              <br/>
              Selective Tenders
                <br/>
                Two-stage selective Tenders
               <br/>
               Dynamic Purchasing System (DPS)
           
                 </marquee>
               </div>
               <div className="tender-item">
                 <h3 className='heads'>Construction Works</h3>
                 <marquee direction="up" className="det">
                 Residential construction
               <br/>
                 Commercial construction
                <br/>
                 Industrial construction
              <br/>
                 Infrastructure construction
                <br/>
                 Institutional construction
               <br/>
                 Mixed-use construction
            <br/>
                 Heavy civil construction
                 </marquee>
   
               </div>
               <div className="tender-item">
                 <h3 className='heads'>Supply of Materials</h3>
   
                 <marquee direction="up" className="det">
               Raw Materials like Cement,Iron,Sand
               <br/>
               Forecasting and planning
                <br/>
                Supplier sourcing
              <br/>
              Request for quotation (RFQ)
                <br/>
                Contract negotiation
               <br/>
               Purchase order and approval
            <br/>
            Inventory management
                 </marquee>
               
               </div>
             </div>
           </div>

          

          
       
         </section>
   
         <section id="contact" className="contact">
           <div className="container">
             <h2 className='process'>Contact Us</h2>
             <form onSubmit={handleSubmitcontact}>
               <div className="form-group">
                 <label htmlFor="name">Name</label>
                 <input name="name" className='cont' value={formData.name} onChange={handleChange}  type="text" id="name" placeholder="Your Name" />
               </div>
               <div className="form-group">
                 <label htmlFor="email">Email</label>
                 <input name="email" className='cont' value={formData.email} onChange={handleChange}  type="email" id="email" placeholder="Your Email" />
               </div>
               <div className="form-group">
                 <label htmlFor="message">Message</label>
                 <textarea className='tex' id="message" value={formData.message} onChange={handleChange} placeholder="Your Message"></textarea>
               </div>
               <button type="submit" className="btn">Submit</button>
             </form>
           </div>
         </section>
   
         <footer className="footer">
           <div className="container">
             <p>&copy; 2025 @ssvconstructions. All rights reserved.</p>
           </div>
         </footer>
       </div>
         
    


    
    
 </>



  );
};

export default Login;



