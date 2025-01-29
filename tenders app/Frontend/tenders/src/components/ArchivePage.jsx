import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Archive.css";

const ArchivePage = () => {
  const navigate = useNavigate(); // Use navigate hook to navigate to the home page
  const [archive, setArchive] = useState([]);

  useEffect(() => {
    loadArchivedTenders();
  }, []);

  const loadArchivedTenders = async () => {
    try {
      const { data } = await axios.get("https://tenders-server.onrender.com/home/api/tenders");
      const currentDate = new Date().toISOString().split("T")[0];
      const archivedTenders = data.filter((tender) => tender.tender_response_by <= currentDate);
      setArchive(archivedTenders);
    } catch (error) {
      console.error("Failed to load archived tenders:", error);
    }
  };

  const handleClose = () => {
    navigate("/"); // Navigate to the home page when close button is clicked
  };

  return (
    <div className="archive">
      <div className="close-btn" onClick={handleClose}>
        <i className="fas fa-times"></i> x
      </div>
      <h2>Archived Tenders</h2>
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
          </tr>
        </thead>
        <tbody>
          {archive.map((tender) => (
            <tr key={tender.tender_id}>
              <td>{tender.tender_id}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArchivePage;