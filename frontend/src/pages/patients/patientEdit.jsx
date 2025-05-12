import { useLocation } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import CallApi from "../../callApi";
import FormInput from "../../components/textFields/formInput";
// import './form.css'

export default function EditPatient() {
  const painMessages = {
    0: "No Hurt",
    2: "Hurts Little Bit",
    4: "Hurts Little More",
    6: "Hurts Even More",
    8: "Hurts Whole Lot",
    10: "Hurts Worst",
  };

  const location = useLocation();
  const { patientData } = location.state || {};
  console.log("patientdata", patientData.Id);
  const [patientID, setPatientID] = useState(patientData.Id);
  const [name, setName] = useState(patientData.Name);
  const [age, setAge] = useState(patientData.Age);
  const [regno, setRegno] = useState(patientData.RegNo);
  const [contact, setContact] = useState(patientData.Contact);
  const [email, setEmail] = useState(patientData.Email);

  const [nationality, setNationality] = useState(patientData.Nationality);
  const [occupation, setOccupation] = useState(patientData.Occupation);
  const [emergencyPhone, setEmergencyPhone] = useState(
    patientData.EmergencyPhone
  );
  const [refferdBy, setRefferdBy] = useState(patientData.RefferedBy);
  const [doctor, setDoctor] = useState(patientData.DoctorId);
  const [healthProblem, setHealthProblem] = useState(patientData.healthProblem);
  const [bloodPresure, setBloodPresure] = useState(patientData.bloodPresure);
  const [allergyProblems, setAllergyProblems] = useState(
    patientData.allergyProblems
  );
  const [thyroidProblems, setThyroidProblems] = useState(
    patientData.thyroidProblems
  );
  const [asthama, setAsthama] = useState(patientData.asthama);
  const [anyOther, setAnyOther] = useState(patientData.anyOther);
  const [medication, setMedication] = useState(patientData.medication);
  const [pregnant, setPregnant] = useState(patientData.pregnant);

  const formRef = useRef(null);
  const [doctorsDropDown, setDoctorsDropDown] = useState();
  const [initialStatement, setInitialStatement] = useState(
    patientData.InitialStatement
  );
  const [painScale, setPainScale] = useState(
    Object.entries(painMessages).find(entry => entry[1] === patientData.PainScale)[0]);
  const [passportNo, setPassportNo] = useState(patientData.PassportNo);
  const [emiratesNo, setEmiratesNo] = useState(patientData.EmiratesNo);
  // const [dubaiNumber,setDubaiNumber] = useState();

  const callDoctors = async () => {
    setDoctorsDropDown(await CallApi("GetAllDoctor"));
  };
  useEffect(() => {
    callDoctors();
  }, []);

  const saveForm = async () => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // === Email Validation ===
    if (!gmailRegex.test(email)) {
      alert("Please enter a valid Gmail address.");
      return;
    }

    const payload = {
      name,
      age,
      regno,
      contact,
      email,
      nationality,
      occupation,
      emergencyPhone,
      refferdBy,
      doctor,
      healthProblem,
      bloodPresure,
      allergyProblems,
      thyroidProblems,
      asthama,
      anyOther,
      medication,
      pregnant,
      painScale: painMessages[painScale],
      initialStatement,
      passportNo,
      emiratesNo,
      patientID,
    };

    const editPatient = async () => {
      const apicall = await CallApi("EditFormEntry", "POST", payload);
      console.log("apicall result", apicall);
    };
    editPatient();
    alert("successfully edit");
    window.location.href = "/dashboard/patients"
  };

  const labels = [
    "No Hurt",
    "Hurts Little Bit",
    "Hurts Little More",
    "Hurts even more",
    "Hurts Whole Lot",
    "Hurts Worst",
  ];

  useEffect(() => {
    console.log("Patient Data:", patientData);
  }, [patientData]);

  if (!patientData) return <div>❌ No patient data provided</div>;

  return (
    <form ref={formRef} className="patientform">
      <div className="card py-3 mb-4 px-3">
        <h2 className="mb-5">Edit Your General Consent Form</h2>

        <h4 className="mb-4">
          Fill One Input Field according to your requirements
        </h4>

        <div className="row">
          <FormInput
            inputType="text"
            inputValue={emiratesNo}
            onInputChange={(e) => setEmiratesNo(e.target.value)}
            label={"Emirate Number"}
            className="col-md-6"
          />
          <FormInput
            inputType="text"
            inputValue={passportNo}
            onInputChange={(e) => setPassportNo(e.target.value)}
            label={"passport Number"}
            className="col-md-6"
          />
        </div>
        <div className="row">
          <FormInput
            inputType="text"
            inputValue={regno}
            onInputChange={(e) => setRegno(e.target.value)}
            label="reg.no"
            className="col-md-6"
          />

          {/* <FormInput inputType="number" inputValue={dubaiNumber} onInputChange={(e)=>setDubaiNumber(e.target.value)} label={"Foreign Number"} className="col-md-6"/> */}
        </div>
      </div>
      <h4 className="mb-4">Edit General Information</h4>
      <div className="row">
        <FormInput
          inputType="text"
          inputValue={name}
          onInputChange={(e) => setName(e.target.value)}
          label="name"
          className="col-md-6"
        />
        <FormInput
          inputType="number"
          inputValue={age}
          onInputChange={(e) => setAge(e.target.value)}
          label="age"
          className="col-md-6"
        />
      </div>
      <div className="row">
        <FormInput
          inputType="email"
          inputValue={email}
          onInputChange={(e) => setEmail(e.target.value)}
          label="email"
          className="col-md-6"
        />
        <FormInput
          inputType="text"
          inputValue={contact}
          onInputChange={(e) => setContact(e.target.value)}
          label="contact"
          className="col-md-6"
        />
      </div>
      <div className="row">
        <FormInput
          inputType="text"
          inputValue={nationality}
          onInputChange={(e) => setNationality(e.target.value)}
          label="Nationality"
          className="col-md-6"
        />

        <FormInput
          inputType="text"
          inputValue={emergencyPhone}
          onInputChange={(e) => setEmergencyPhone(e.target.value)}
          label="Emergency Phone #"
          className="col-md-6"
        />
      </div>
      <div className="row">
        <FormInput
          inputType="text"
          inputValue={occupation}
          onInputChange={(e) => setOccupation(e.target.value)}
          label="Occupation"
          className="col-md-6"
        />
        <FormInput
          inputType="text"
          inputValue={refferdBy}
          onInputChange={(e) => setRefferdBy(e.target.value)}
          label="Reffered To Us By"
          className="col-md-6"
        />
      </div>
      <div className="row">
        <div className="col-md-6">
          <label>Consulting Dr</label>
          <select onChange={(e) => setDoctor(e.target.value)}>
            {doctorsDropDown &&
              doctorsDropDown.map((doc) => (
                <option value={doc.Id}>{doc.Name}</option>
              ))}
          </select>
        </div>
      </div>
      <div>
        <h4 className="mb-3 mt-4">medical health histroy</h4>
      </div>
      <div>
        <label>BLOOD PRESURE</label>
        <input
          type="checkbox"
          checked={bloodPresure}
          onChange={(e) => setBloodPresure(e.target.checked)}
        />
      </div>
      <div>
        <label>HEART PROBLEM</label>
        <input
          type="checkbox"
          checked={healthProblem}
          onChange={(e) => setHealthProblem(e.target.checked)}
        />
      </div>
      <div>
        <label>ALLERGY PROBLEMS</label>
        <input
          type="checkbox"
          checked={allergyProblems}
          onChange={(e) => setAllergyProblems(e.target.checked)}
        />
      </div>
      <div>
        <label>ASTHAMA</label>
        <input
          type="checkbox"
          checked={asthama}
          onChange={(e) => setAsthama(e.target.checked)}
        />
      </div>
      <div>
        <label>THYROID PROBLEM</label>
        <input
          type="checkbox"
          checked={thyroidProblems}
          onChange={(e) => setThyroidProblems(e.target.checked)}
        />
      </div>
      <div className="row mt-4">
        <FormInput
          inputType="text"
          label="Any Other Medical Problem Please Specify"
          className="col-md-12"
          inputValue={anyOther}
          onInputChange={(e) => setAnyOther(e.target.value)}
        />
        <FormInput
          inputType="text"
          label="During The-Past 12 Months Are You On Any Medication/Treatment?"
          className="col-md-12"
          inputValue={medication}
          onInputChange={(e) => setMedication(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label>ARE YOU PREGNANT? (For Women Only)</label>
        <input
          type="checkbox"
          checked={pregnant}
          onChange={(e) => setPregnant(e.target.checked)}
        />
      </div>
      <div className="mt-3 mb-4">
        <label htmlFor="textarea">initial statement</label>
        <br></br>
        <textarea
          className="form-control"
          rows={5}
          placeholder="Describe Your Initial Statement"
          value={initialStatement}
          onChange={(e) => setInitialStatement(e.target.value)}
        />
      </div>
      <br />

      <h2 className="text-xl font-bold  mb-5">Pain Measurement Scale</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        {labels.map((label, index) => (
          <span
            key={index}
            style={{ flex: 1, textAlign: "center", fontSize: "14px" }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max="10"
        step={"2"}
        value={painScale}
        onChange={(e) => setPainScale(Number(e.target.value))}
        className="w-full max-w-md"
        style={{ width: "100%" }}
      />

      {/* Selected Value Display */}
      <p className="mt-4 text-lg font-medium">
        Selected: {painScale} - {painMessages[painScale]}
      </p>

      <br />

      <div className="d-flex">
        <button type="button" className="butn-sec mt-4 " onClick={saveForm}>
          Save
        </button>
      </div>
      {/* <img src={dataURL}/> */}
    </form>
  );
}
