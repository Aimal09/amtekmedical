import React, { useEffect, useState } from "react";
import CallApi from "../../callApi";

function DoctorClients() {
  const [patientList, setPatientList] = useState([]);
  const [filteredPatientList, setFilteredPatientList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const doctorId = JSON.parse(localStorage.data)?.userData?.id;

      if (!doctorId) {
        console.error("Doctor ID not found in local storage.");
        return;
      }

      const url = `GetDoctorClients?doctorId=${doctorId}`;
      const data = await CallApi(url);
      const updatedData = data.map((item) => ({
        ...item,
        editableAmount: item.Amount, // local editable copy
      }));

      setPatientList(updatedData);
      setFilteredPatientList(updatedData);
    };

    fetchData();
  }, []);

   useEffect(() => {
    const fetchData = async () => {
      const doctorId = JSON.parse(localStorage.data)?.userData?.id;
      console.log("DoctorId from localStorage:", doctorId);

      if (!doctorId) {
        console.error("Doctor ID not found in local storage.");
        return;
      }

      // Fetch data from new API with doctorId as query param
            const url = `GetDoctorClients?doctorId=${doctorId}`;

      const data = await CallApi(url);

      console.log("Data from API:", data);
      setPatientList(data);
      setFilteredPatientList(data);
    };

    fetchData();
  }, []);

  const handleAmountChange = (index, value) => {
    const updated = [...filteredPatientList];
    updated[index].editableAmount = value;
    setFilteredPatientList(updated);
  };

  const handleUpdateAmount = async (CaseSheetId, amount) => {
    try {
      // 👇 Call your backend update API
      const result = await CallApi("UpdateAmount", "POST", {
        CaseSheetId,
        amount,
      });
      console.log("Update result:", result);
      if (result.success) {
        alert("Amount updated successfully!");
        // Optional: refresh list
      } else {
        alert("Failed to update amount.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating amount.");
    }
  };

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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatientList.map((patient, index) => (
            <tr key={index}>
              <td>{patient.PatientName}</td>
              <td>{patient.PatientId}</td>
              <td>{patient.Contact}</td>
              <td>{patient.Email}</td>
              <td>
                <input
                  type="number"
                  value={patient.editableAmount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                />
              </td>
              <td>
                <button
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                  }}
                  onClick={() =>
                    handleUpdateAmount(
                      patient.PatientId,
                      patient.editableAmount,
                      patient.CaseSheetId
                    )
                  }
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorClients;
