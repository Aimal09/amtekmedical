import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SlideInPanel from "../../components/slidein";
import "./doctorform.css";
import CallApi from "../../callApi";
import SlideIn from "../../components/slidein";
import SignaturePad from "../../components/signaturePad/signaturePad";
import ConsentButton from "./slideinButoons";

const ScheduleDetails = () => {
  const { search } = useLocation();
  const [query] = useSearchParams(search);
  const [appoinmentId, setAppoinmentId] = useState(query.get("id"));
  const [appoinment, setAppoinment] = useState({});
  const [date, setDate] = useState("");
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
  // const [formId, setFormId] = useState([]);

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
      doctorDiagnosis: doctorDiagnosis,
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
                <label htmlFor="dropdown">Doctor Diagnosis</label>
                <select
                  className="form-control"
                  value={doctorDiagnosis}
                  disabled={disable}
                  onChange={(e) => setDoctorDiagnosis(e.target.value)}
                >
                  <option value="">-- Select Diagnosis --</option>
                  {diagnosisOptions.map((option) => (
                    <option key={option.Id} value={option.Title}>
                      {option.Title}
                    </option>
                  ))}
                </select>
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
                    <td>{app.DoctorDiagnosis || "N/A"}</td>
                    <td>{app.Amount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetails;
