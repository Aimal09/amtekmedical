import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import CallApi from "../../callApi";
import FormInput from "../../components/textFields/formInput";

const ScheduleDetails = () => {
  const { search } = useLocation();
  const [query] = useSearchParams(search);
  const [appoinmentId, setAppoinmentId] = useState(query.get("id"));
  const [appoinment, setAppoinment] = useState({});
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedVisit, setSelectedVisit] = useState(false);
  const [description, setDescription] = useState("");
  const [appoinmentHistory, setAppoinmentHistory] = useState();
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    const fetchAppointmentById = async () => {
      let apiURL = `GetAppointmentById?id=${appoinmentId}`;

      try {
        const data = await CallApi(apiURL);
        console.log("Fetched Data:", data); // Yeh check karne ke liye
        if (data.length > 0) {
          setAppoinment(data[0]); // Pehla object state me save karo
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    fetchAppointmentById();
  }, [appoinmentId]);

  useEffect(() => {
    const fetchAppointmentByAppointmentId = async () => {
      let apiURL = `GetAppointmentByAppointmentId?appoinmentId=${appoinmentId}`;

      try {
        const data = await CallApi(apiURL);
        console.log("Fetched Data by AppoinmentId:", data);
        if (data.length > 0) {
          setAppoinmentHistory(data); // Pehla object state me save karo

          setDisable(data.some((item) => item.AppointmentId == appoinmentId));
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    if (appoinmentId) {
      // Agar ID available hai tabhi call karo
      fetchAppointmentByAppointmentId();
    }
  }, [appoinmentId]);

  const appoinmentForm = async () => {
    const payload = {
      createdOn: date || new Date().toISOString(),
      amount,
      appointmentId: appoinmentId, // Backend ke field name ka dhyan rakhna
      prescription: description,
    };
    console.log("Payload being sent:", payload);
    try {
      console.log("before api calll Payload being sent:", payload);
      const savedata = await CallApi("AddCasesheet", "POST", payload);
      console.log("After  api calll Payload being sent:", payload);
      console.log("Response from API:", savedata); // Response check karne ke liye
    } catch (error) {
      console.error("Error while saving data:", error);
    }
    setDate("");
    setAmount("");
    setDescription("");
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-lg">
        <div className="row">
          {/* Left Side: Patient Information */}
          <div className="col-md-4">
            <h5 className="mb-3">Patient Details</h5>

            <p className="fs-5">
              <strong>Name:</strong> {appoinment.Name}
            </p>
            <p className="fs-5">
              <strong>Age:</strong> {appoinment.Age}
            </p>
            {/* <p className="fs-5"><strong>Gender:</strong> {appoinment.gender}</p> */}
            <p className="fs-5">
              <strong>Nationality:</strong> {appoinment.Nationality}
            </p>
            {/* <p className="fs-5"><strong>Address:</strong> {appoinment.address}</p> */}
            <p className="fs-5">
              <strong>Phone Number:</strong> {appoinment.Contact}
            </p>
            <p className="fs-5">
              <strong>Heart Problem:</strong>{" "}
              {appoinment.healthProblem ? "Yes" : "No"}
            </p>
            <p className="fs-5">
              <strong>Allergy Problems :</strong>{" "}
              {appoinment.allergyProblems ? "Yes" : "No"}
            </p>
            <p className="fs-5">
              <strong>Blood Pressure:</strong>{" "}
              {appoinment.bloodPresure ? "Yes" : "No"}
            </p>
            <p className="fs-5">
              <strong>Thyroid Problems :</strong>{" "}
              {appoinment.thyroidProblems ? "Yes" : "No"}
            </p>
            <p className="fs-5">
              <strong>Asthama:</strong> {appoinment.asthama ? "Yes" : "No"}
            </p>
            <p className="fs-5">
              <strong>Medication:</strong> {appoinment.medication}
            </p>
            <p className="fs-5">
              <strong>AnyOther Problem:</strong> {appoinment.anyOther}
            </p>
            <p className="fs-5">
              <strong>Pregnant :</strong> {appoinment.pregnant ? "Yes" : "No"}
            </p>
          </div>

          {/* Right Side: Table for Complaints */}
          <div className="col-md-8">
            <h5>Doctor Form</h5>
            <div className="row">
              <div className="input-with-label col-md-6">
                <label htmlFor="input">Date</label>
                <input
                  type="date"
                  value={date || ""}
                  disabled={disable}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="input-with-label col-md-6">
                <label htmlFor="input">Amount</label>
                <input
                  type="text"
                  disabled={disable}
                  value={amount || ""}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="textarea">Complaint-Finding-Treatment</label>
              <textarea
                className="form-control"
                  disabled={disable}
                  rows={10}
                placeholder="Enter your Problem Here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {!disable &&
              <button
                type="button"
                className="butn-sec mt-4 mr-4"
                onClick={appoinmentForm}
              >
                Save
              </button>
            }
          </div>
        </div>
        <div className="mt-3">
          <h5>Patient Visit History Table</h5>
          <table className="mt-3 table table-striped">
            <thead>
              <tr>
                <th>Date of Visit</th>
                <th>Appointment Date</th>
                <th>Patient Name</th>
                <th>Prescription</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {appoinmentHistory &&
                appoinmentHistory.map((app) => (
                  <tr onClick={() => setSelectedVisit(true)}>
                    <td>{app.CreatedOn}</td>
                    <td>{app.AppointmentDate}</td>
                    <td>{app.PatientName}</td>
                    <td>{app.Prescription}</td>
                    <td>{app.Amount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedVisit && (
        <div className="card p-4 shadow-lg mt-4">
          <h5>Visit Details</h5>
          <p>
            <strong>Date:</strong> {selectedVisit.date}
          </p>
          <p>
            <strong>Doctor:</strong> {selectedVisit.doctor}
          </p>
          <p>
            <strong>Diagnosis:</strong> {selectedVisit.diagnosis}
          </p>
          <p>
            <strong>Symptoms:</strong> {selectedVisit.symptoms}
          </p>
          <p>
            <strong>Treatment:</strong> {selectedVisit.treatment}
          </p>
          <p>
            <strong>Amount:</strong> {selectedVisit.amount}
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedVisit(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleDetails;
