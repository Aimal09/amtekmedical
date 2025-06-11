import React, { useEffect, useState } from "react";
import CallApi from "../../callApi";

function DoctorClientsById() {
  const [patientList, setPatientList] = useState([]);
  const [filteredPatientList, setFilteredPatientList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let doctorId = JSON.parse(localStorage.data)?.userData?.id;
      console.log("DoctorId from localStorage:", doctorId);


      if (!doctorId) {
        console.error("Doctor ID not found in local storage.");
        return;
      }

      // Fetch data from new API with doctorId as query param
      const url = `GetDoctorClientsById?doctorId=${doctorId}`;
      const data = await CallApi(url);

      console.log("Data from API:", data);
      setPatientList(data);
      setFilteredPatientList(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Doctor Clients</h1>
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Patient ID</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatientList.map((patient, index) => (
            <tr key={index}>
              <td>{patient.PatientName}</td>
              <td>{patient.PatientId}</td>
              <td>{patient.Contact}</td>
              <td>{patient.Email}</td>
              <td>{patient.Amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default DoctorClientsById;