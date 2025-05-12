import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SlideInPanel from "../../components/slidein";
import "./doctorform.css";
import CallApi from "../../callApi";
import SlideIn from "../../components/slidein";
import SignaturePad from "../../components/signaturePad/signaturePad";
import ConsentButton from "./slideinButoons";
import ComboBox from "../../components/combobox";
import { Button } from "bootstrap";
import { useNavigate } from "react-router-dom";

const ScheduleDetails = () => {
  const { search } = useLocation();
  const [query] = useSearchParams(search);
  const [appoinmentId, setAppoinmentId] = useState(query.get("id"));
  const [appoinment, setAppoinment] = useState({});
  const [date, setDate] = useState(`${(new Date()).getFullYear()}-${((new Date()).getMonth() + 1).toString().padStart(2,'0')}-${((new Date()).getDate()).toString().padStart(2,'0')}`);
  const [amount, setAmount] = useState("");
  const [selectedVisit, setSelectedVisit] = useState(false);
  const [description, setDescription] = useState("");
  const [doctorDiagnosis, setDoctorDiagnosis] = useState("");
  const [appoinmentHistory, setAppoinmentHistory] = useState();
  const [disable, setDisable] = useState(false);
  const [diagnosisOptions, setDiagnosisOptions] = useState([]); // Database se data lane ke liye state
  const [showSlideIn, setShowSlideIn] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const sigCanvas = useRef(null);
  const [isSigned, setIsSigned] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [selectedConsent, setSelectedConsent] = useState(null);
  const [forms, setForms] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);   // jis record ko dekhna hai
  const [showModal, setShowModal] = useState(false);
  // const [formId, setFormId] = useState([]);

  const navigate = useNavigate();

  const backCalender = ()=>{
    navigate("/calendar")
  }

  let[conseltantform,setConseltantform] = useState([]);

  useEffect(() => {
    const fetchAppointmentById = async () => {
      let apiURL = `GetAppointmentById?id=${appoinmentId}`;
      try {
        const data = await CallApi(apiURL);
        if (data.length > 0) {
          setAppoinment(data[0]);
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
        if (data.length > 0) {
          setAppoinmentHistory(data);
          setDisable(data.some((item) => item.AppointmentId == appoinmentId));
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };
    if (appoinmentId) {
      fetchAppointmentByAppointmentId();
    }
  }, [appoinmentId]);

  // Diagnosis data fetch karne ka function
  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const data = await CallApi("GetDiagnosis"); // API call to fetch diagnosis
        setDiagnosisOptions(data); // Set fetched data
      } catch (error) {
        console.error("Error fetching diagnosis data:", error);
      }
    };
    fetchDiagnosis();
  }, []);

  const appoinmentForm = async () => {
    const payload = {
      createdOn: date || new Date().toISOString(),
      amount,
      appointmentId: appoinmentId,
      prescription: description,
      doctorDiagnosis: doctorDiagnosis.label,
    };
    console.log("Payload being sent:", payload);
    try {
      const savedata = await CallApi("AddCasesheet", "POST", payload);
      console.log("Response from API:", savedata);
    } catch (error) {
      console.error("Error while saving data:", error);
    }
    setDate("");
    setAmount("");
    setDescription("");
    setDoctorDiagnosis("");
    alert("successfully submited")
  };

  const handleButtonClick1 = (text) => {
    setSelectedText(text);
    setShowSlideIn(true);
  };
  const handleEnd = () => {
    if (sigCanvas.current) {
      setIsSigned(sigCanvas.current.toData().length > 0);
    }
  };

  // useEffect hata diya, kyunki handleEnd directly signature detect karega

  const handleSave = async () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL(); // Convert to base64 image
      console.log("Signature Saved:", signatureData);
      console.log("Base64 Signature Data:", signatureData);

  
      const payload = {
        formId: selectedConsent, // Yeh ab correct Id hoga
        signatureUrl: signatureData,
        patientId: appoinment?.PatientId || "",
        appointmentId: appoinmentId || ""
      };
      try {
        const response = await CallApi("InsertConsentFormSigned", "POST", payload);
        console.log("Signature sent to backend:", response);
      } catch (error) {
        console.error("Error sending signature:", error);
      }
  
      sigCanvas.current.clear(); // clear signature pad after save
      setIsSigned(false);
    }
  };
  

  const handleButtonClick = (text,formId) => {
    setSelectedText(text);
    setShowSlideIn(true);
    setSelectedConsent(formId);
    setShowButtons(false); // Baqi buttons hide karne ke liye
  };
  // const handleClick = () => {
  //   const finalText = (description || '').replace(/\$\$/g, patientName || '__________');
  //   if (onClick) {
  //     onClick(finalText);
  //   }
  // };


  const handleBack = () => {
    setShowButtons(true);
    setSelectedText(""); // Selected text ko clear kar do
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await CallApi("consultantforms");
      conseltantform = response;
      console.log("API Response:", response);

  
      const cleaned = response.map((item) => ({
        id: item.Id,  // <-- Yeh important hai
        title: item.Title || "No Title",
        description: item.FormFields || "",
      }));
      setForms(cleaned);
    };
  
    fetchData();
  }, []);

  useEffect(()=>{
    let getsignatureforms = async ()=>{
      let res = CallApi("ConsentFormsSigned");
     console.log("yehan pey getsignatuedformed aye gha",res)
    }
    getsignatureforms();
  },[])

 
  
  // const handleClick = () => {
  //   const finalText = (description || '').replace(/\$\$/g, patientName || '');
  //   onClick(finalText);
  // };
  
  const handleView = (row) => {
    setSelectedRow(row);   // pura object store kar lo
    setShowModal(true);    // modal khol do
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-lg">
        <div className="row">
          <div className="col-md-4">
            <h5 className="mb-3">Patient Details</h5>
            <p className="fs-5">
              <strong>Name:</strong> {appoinment.Name}
            </p>
            <p className="fs-5">
              <strong>Age:</strong> {appoinment.Age}
            </p>
            <p className="fs-5">
              <strong>Nationality:</strong> {appoinment.Nationality}
            </p>
            <p className="fs-5">
              <strong>Phone Number:</strong> {appoinment.Contact}
            </p>
            <p className="fs-5">
              <strong>Reg No:</strong> {appoinment.RegNo}
            </p>
            <p className="fs-5">
              <strong>Emirates No:</strong> {appoinment.EmiratesNo}
            </p>
            <p className="fs-5">
              <strong>Passport No:</strong> {appoinment.PassportNo}
            </p>
            <p className="fs-5">
            <strong>Email:</strong> {appoinment.Email}
            </p>
            <p className="fs-5">
            <strong>Occupation:</strong> {appoinment.Occupation}
            </p>
            <p className="fs-5">
            <strong>Emergency Phone:</strong> {appoinment.EmergencyPhone}
            </p>
            <p className="fs-5">
            <strong>RefferedBy:</strong> {appoinment.RefferedBy}
            </p>
            <p className="fs-5">
              <strong>HealthProblem :</strong> {appoinment.healthProblem ? 'Yes' : 'No'}
            </p>
            <p className="fs-5">
            <strong>BloodPresure:</strong> {appoinment.bloodPresure ? 'Yes' : 'No'}
            </p>
            <p className="fs-5">
            <strong>AllergyProblems:</strong> {appoinment.allergyProblems ? 'Yes' : 'No'}
            </p>
            <p className="fs-5">
            <strong>ThyroidProblems:</strong> {appoinment.thyroidProblems ? 'Yes' : 'No'}
            </p>
            <p className="fs-5">
            <strong>Asthama:</strong> {appoinment.asthama ? 'Yes' : 'No'}
            </p>
            <p className="fs-5">
            <strong>Pregnant:</strong> {appoinment.pregnant ? 'Yes' : 'No'}
            </p>
            <p className="fs-5">
            <strong>PainScale:</strong> {appoinment.PainScale}
            </p>
            <p className="fs-5">
            <strong>InitialStatement:</strong> {appoinment.InitialStatement}
            </p>
            <p className="fs-5">
            <strong>DoctorName:</strong> {appoinment.DoctorName}
            </p>
          </div>
          
          <div className="col-md-8">
            <div className="p-3 slide-in-container">
              <h5>Doctor Form</h5>
              <div className="row">
                <div className="input-with-label col-md-6">
                  <label htmlFor="input">Date</label>
                  <input
                    type="date"
                    value={date || ""}
                    disabled={true}
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
              <div className="mt-3">
                <label htmlFor="textarea">Complaint-Finding-Treatment</label>
                <textarea
                  className="form-control"
                  disabled={disable}
                  rows={5}
                  placeholder="Enter Patient's Problem Here"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <label htmlFor="dropdown"> Select Diagnosis</label>

                <ComboBox data={diagnosisOptions.map(d => ({value:d.Id, label:d.Title}))} onSelect={setDoctorDiagnosis}/>
                
              </div>
              <button
                type="button"
                className="btn btn-secondary mt-4"
                onClick={() => setShowSlideIn(true)}
              >
                Concent Forms
              </button>
              <SlideIn
                show={showSlideIn}
                setShowSlideIn={setShowSlideIn}
                title="Patient Details"
              >
                <div className="card p-4">
                  <h5>Consental Forms </h5>
                  
                  {showButtons && forms.length > 0 && (
  <>
   {forms.map((form, index) => (
  <ConsentButton
    key={index}
    title={form.title}
    description={(form.description || '').replace(/\$\$/g, appoinment?.Name || '')}
    patientName={appoinment?.Name || '__________'}
    onClick={() => handleButtonClick((form.description || '').replace(/\$\$/g, appoinment?.Name || ''), form.id)} // <-- yahan pass kar raha hai
  />
))}
  </>
)}


                  <br />

                  {/* Show paragraph when button is clicked */}
                  {selectedText && (
                    <>
                      <p className="mt-3">{selectedText}</p>
                      <SignaturePad ref={sigCanvas} onEnd={handleEnd} />
                      <style>
                        {`
    .sigCanvas {
      background-color: #e0e0e0 !important; /* Light Grey Override */
    }
  `}
                      </style>
                      <div className="buttons my-3 d-flex">
                        <button
                          type="button"
                          className="butn"
                          onClick={handleSave}
                          // disabled={!isSigned}
                        >
                          Save
                        </button>
                        <button
                          className="butn-sec"
                          onClick={handleBack}
                        >
                          Back
                        </button>
                      </div>
                    </>
                  )}
                </div>

              </SlideIn>
              <button
              onClick={backCalender}
              type="button"
                className="butn-sec mt-4 mr-4"
              >back</button>
              {/* mai yahan ek button chahta hn jis k click pey slide in khul ja  */}
            </div>
            {!disable && (
              <button
                type="button"
                className="butn-sec mt-4 mr-4"
                onClick={appoinmentForm}
              >
                Save
              </button>
            )}
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
                <th>Doctor Diagnosis</th>
                <th>Amount</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {appoinmentHistory &&
                appoinmentHistory.map((app, index) => (
                  <tr key={index} onClick={() => setSelectedVisit(app)}>
                    <td>{app.CreatedOn}</td>
                    <td>{app.AppointmentDate}</td>
                    <td>{app.PatientName}</td>
                    <td>{app.Prescription}</td>
                    <td>{app.doctorDiagnosis || "N/A"}</td>
                    <td>{app.Amount}</td>
                    <td>
                  <a
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handleView(app)}
                  >
                    view
                  </a>
                </td>
                
                  </tr>
                ))}
            </tbody>
          </table>
          {showModal && selectedVisit && (
  <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Visit Details</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          />
        </div>
        <div className="modal-body">
          <p><strong>Date of Visit:</strong> {selectedVisit.CreatedOn}</p>
          <p><strong>Appointment Date:</strong> {selectedVisit.AppointmentDate}</p>
          <p><strong>Patient Name:</strong> {selectedVisit.PatientName}</p>
          <p><strong>Prescription:</strong> {selectedVisit.Prescription}</p>
          <p><strong>Doctor Diagnosis:</strong> {selectedVisit.doctorDiagnosis}</p>
          <p><strong>Amount:</strong> {selectedVisit.Amount}</p>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
  
};




export default ScheduleDetails;

