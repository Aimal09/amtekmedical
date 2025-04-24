// import React, { useEffect, useState } from "react";
// import CallApi from "../../callApi";
// import FormInput from "../../components/textFields/formInput";

// export default function Patients() {
//     const [patientList, setPatientList] = useState([]);
//     const [searchValue, setSearchValue] = useState('');
//     const [filteredPatientList, setFilteredPatientList] = useState([]);
//     const [formImage, setFormImage] = useState('');

//     useEffect(() => {
//         const fetchData = async () => {
//             let data = await CallApi('GetPatients');
//             setPatientList(data);
//             setFilteredPatientList(data);
//         };

//         fetchData();
//     }, []);

//     const search = (e) => {
//         const value = e.target.value.toLowerCase();
//         setSearchValue(value);
//         if (value) {
//             const filteredList = patientList.filter((row) =>
//                 Object.values(row).some(val =>
//                     String(val).toLowerCase().includes(value)
//                 )
//             );
//             setFilteredPatientList(filteredList);
//         } else {
//             setFilteredPatientList(patientList);
//         }
//     };

//     const viewForm = (e)=>{
//         setFormImage(e.target.dataset.img);
//     }

//     return (
//         <>
//             <div className="d-flex justify-content-between">
//                 <h3 className="mb-4">Patients List</h3>
//                 <FormInput placeholder="Search" onInputChange={e=>search(e)}/>
//             </div>
//             <div className="table">

//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Age</th>
//                             <th>Email</th>
//                             <th>Contact</th>
//                             <th>Reg.No</th>
//                             <th>Occupation</th>
//                             <th>Nationality</th>
//                             <th>EmergencyPhone</th>
//                             <th>RefferedBy</th>
//                             <th>DoctorID</th>
//                             <th>Consent Form</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredPatientList.map((row, index) => (
//                             <tr key={index}>
//                                 <td>{row.Name}</td>
//                                 <td>{row.Age}</td>
//                                 <td>{row.Email}</td>
//                                 <td>{row.Contact}</td>
//                                 <td>{row.RegNo}</td>
//                                 <td>{row.Occupation}</td>
//                                 <td>{row.Nationality}</td>
//                                 <td>{row.EmergencyPhone}</td>
//                                 <td>{row.RefferedBy}</td>
//                                 <td>{row.DoctorId}</td>
//                                 <td><a data-img={row.FormImageUrl} onClick={(e)=>viewForm(e)}>view</a></td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 <img src={formImage}/>
//             </div>
//         </>
//     );
// }

import React, { useEffect, useState } from "react";
import CallApi from "../../callApi";
import FormInput from "../../components/textFields/formInput";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Patients() {
  const [patientList, setPatientList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredPatientList, setFilteredPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [signatureImg, setSignatureImg] = useState("");
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedFormText, setSelectedFormText] = useState("");
  const [formText, setFormText] = useState("");
  const [consultantForms, setConsultantForms] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  // const [signatureImg, setSignatureImg] = useState("");
  const [patientSignature, setPatientSignature] = useState("");

  // Get all patients on mount
  useEffect(() => {
    const fetchData = async () => {
      let data = await CallApi("GetPatients");
      setPatientList(data);
      setFilteredPatientList(data);
    };
    fetchData();
  }, []);

  // Search logic
  const search = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    if (value) {
      const filteredList = patientList.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(value)
        )
      );
      setFilteredPatientList(filteredList);
    } else {
      setFilteredPatientList(patientList);
    }
  };

  // View form logic
  useEffect(() => {
    const fetchConsultantForms = async () => {
      const res = await CallApi("consultantforms");
      setConsultantForms(res); // <-- Save all forms for matching later
    };
    fetchConsultantForms();
  }, []);

  const viewForm = async (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);

    try {
      const res = await CallApi("ConsentFormsSigned");
      console.log("ConsentFormsSigned Response:", res);

      // Patient ID aur FormId match karo
      const matchedEntry = res.find(
        (x) => x.PatientId === patient.Id && x.FormId !== 0
      );

      if (matchedEntry) {
        const matchedForm = consultantForms.find(
          (f) => f.Id === matchedEntry.FormId
        );

        if (matchedForm) {
          const replacedText = matchedForm.FormFields.replace(
            /\$\$/g,
            patient.Name
          );
          setFormText(replacedText); // <-- show form text
          setFormTitle(matchedForm.Title);
        } else {
          setFormText("❌ No matching form text found");
          setFormTitle("");
        }

        const cleanedUrl = matchedEntry.SignatureUrl.replace(/\\/g, "/");
        setSignatureImg(cleanedUrl);
      } else {
        setFormText("❌ No matching signature entry found");
        setSignatureImg("");
      }
      // ✅ Patient Signature from patient API
      if (patient.signatureURL) {
        const cleaned = patient.signatureURL.replace(/\\/g, "/");
        setPatientSignature(cleaned);
      } else {
        setPatientSignature("");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }; // <- important dependency!

  return (
    <>
      <div className="d-flex justify-content-between">
        <h3 className="mb-4">Patients List</h3>
        <FormInput placeholder="Search" onInputChange={(e) => search(e)} />
      </div>

      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Reg.No</th>
              <th>Occupation</th>
              <th>Nationality</th>
              <th>EmergencyPhone</th>
              <th>RefferedBy</th>
              <th>DoctorID</th>
              <th>Consent Form</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatientList.map((row, index) => (
              <tr key={index}>
                <td>{row.Name}</td>
                <td>{row.Age}</td>
                <td>{row.Email}</td>
                <td>{row.Contact}</td>
                <td>{row.RegNo}</td>
                <td>{row.Occupation}</td>
                <td>{row.Nationality}</td>
                <td>{row.EmergencyPhone}</td>
                <td>{row.RefferedBy}</td>
                <td>{row.DoctorId}</td>
                <td>
                  <a
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => viewForm(row)}
                  >
                    view
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signature Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Consent Form Signatures</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formText && (
            <div className="mb-3">
              <p>
                <strong>{formTitle}:</strong>
              </p>
              <p>{formText}</p>
            </div>
          )}

          {signatureImg && (
            <div>
              <p>
                <strong>Signature:</strong>
              </p>
              <img
                src={signatureImg}
                alt="Signature"
                style={{ width: "100%", border: "1px solid #ccc" }}
              />
            </div>
          )}

          {patientSignature && (
            <div className="mt-3">
              <p>
                <strong>Patient Signature:</strong>
              </p>
              <img
                src={patientSignature}
                alt="Patient Signature"
                style={{ width: "100%", border: "1px solid #ccc" }}
              />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
