import React from 'react';
import { useEffect, useState } from "react";
import CallApi from "../../callApi";



function DoctorClients() {
const [patientList, setPatientList] = useState([]);
const [filteredPatientList, setFilteredPatientList] = useState([]);
     useEffect(() => {
  const fetchData = async () => {
    let data = await CallApi("GetPatients");

    const doctorId = JSON.parse(localStorage.data).userData.id // doctorId from local storage
    console.log("DoctorId from localStorage:", JSON.parse(localStorage.data).userData.id);


    if (!doctorId) {
      console.error("Doctor ID not found in local storage.");
      return;
    }

    // Filter patients by doctorId
    const filtered = data.filter(patient => 
      String(patient.DoctorId) === String(doctorId) // safe compare as string
    );

    setPatientList(filtered);
    setFilteredPatientList(filtered);
  };

  fetchData();
}, []);


  return (
    <div>
        {/* now i want to show filteredpatientlist */}
        <h1>Doctor Clients</h1>
        <table>
            <thead>
                <tr>
                    <th>Patient Name</th>
                    <th>Patient ID</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {filteredPatientList.map((patient, index) => (
                    <tr key={index}>
                        <td>{patient.Name}</td>
                        <td>{patient.Id}</td>
                        <td>{patient.Contact}</td>
                        <td>{patient.Email}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default DoctorClients