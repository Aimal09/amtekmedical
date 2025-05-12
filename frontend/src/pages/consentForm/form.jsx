import React, { useState, useRef, useEffect } from 'react';
import CallApi from '../../callApi';
import FormInput from '../../components/textFields/formInput';
import './form.css'
import SignaturePad from '../../components/signaturePad/signaturePad';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';

function Forms() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [regno, setRegno] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    
    const [nationality, setNationality] = useState('');
    const [occupation, setOccupation] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [refferdBy, setRefferdBy] = useState('');
    const [doctor, setDoctor] = useState('');
    const [healthProblem, setHealthProblem] = useState();
    const [bloodPresure, setBloodPresure] = useState();
    const [allergyProblems, setAllergyProblems] = useState();
    const [thyroidProblems, setThyroidProblems] = useState();
    const [asthama, setAsthama] = useState();
    const [anyOther, setAnyOther] = useState('');
    const [medication, setMedication] = useState('');
    const [pregnant, setPregnant] = useState('');

    const [dataURL, setDataURL] = useState('');
    const [printDisabled, setPrintDisabled] = useState(true);
    const sigCanvas = useRef(null);
    const formRef = useRef(null);
    const [doctorsDropDown, setDoctorsDropDown] = useState();
    const [initialStatement,setInitialStatement] = useState("");
    const [painScale, setPainScale] = useState(0);
    const [passportNo, setPassportNo] = useState();
    const [emiratesNo,setEmiratesNo] = useState();
    // const [dubaiNumber,setDubaiNumber] = useState();

    const callDoctors = async() => {setDoctorsDropDown(await CallApi('GetAllDoctor'))}
    useEffect(()=>{
        callDoctors();
    },[]);


    const saveForm = async () => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    
        // === Email Validation ===
        if (!gmailRegex.test(email)) {
            alert("Please enter a valid Gmail address.");
            return;
        }
    
        // === Signature Validation ===
        if (sigCanvas.current && sigCanvas.current.isEmpty()) {
            alert("Please provide a signature before submitting.");
            return;
        }
    
        let formHtml = formRef.current.cloneNode(true);
        document.body.appendChild(formHtml);
    
        formHtml.style.padding = '10px'
        formHtml.querySelectorAll('button').forEach(d => d.style.display = 'none')
        formHtml.querySelectorAll('.col-md-6').forEach(d => {
            d.classList.remove('col-md-6');
            d.classList.add('col-md-12');
        })
        formHtml.querySelectorAll('input, select').forEach(d => {
            d.style.border = 'none';
            d.style.borderBottom = '1px solid #777';
            d.style.color = '#000';
        })
    
        const signImg = sigCanvas.current.toDataURL();
        let signImg1 = document.createElement('img');
        signImg1.src = signImg;
        formHtml.querySelector('.signature-pad canvas.sigCanvas').replaceWith(signImg1);
    
        const payload = {
            name, age, regno, contact, email, nationality, occupation, emergencyPhone,
            refferdBy, doctor, healthProblem, bloodPresure, allergyProblems, thyroidProblems,
            asthama, anyOther, medication, pregnant, painScale: painMessages[painScale], initialStatement, passportNo, emiratesNo, signImg
        };
    
        html2canvas(formHtml, { scale: 2 }).then(async (canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("Customer-Bill.pdf");
    
            document.body.removeChild(formHtml);
            setDataURL(imgData);
            setPrintDisabled(false);
    
            const result = await CallApi('AddFormEntry', 'POST', payload);
            console.log("API Response:", result);
            alert("Form submitted successfully!");
            setName('');
            setAge('');
            setRegno('');
            setContact('');
            setEmail('');
            setNationality('');
            setOccupation('');
            setEmergencyPhone('');
            setRefferdBy('');
            setDoctor('');
            setHealthProblem('');
            setBloodPresure('');
            setAllergyProblems('');
            setThyroidProblems('');
            setAsthama('');
            setAnyOther('');
            setMedication('');
            setPregnant('');
            setPainScale(0);
            setInitialStatement('');
            setPassportNo('');
            setEmiratesNo('');
            setDataURL(null);
            setPrintDisabled(true);
        
            // ✅ Clear signature pad
            sigCanvas.current.clear();
        });
    };
    

    const printForm = async () => {
        // await saveForm();

        // Open new window with A4-sized content
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
                <html>
                <head>
                    <style>
                        @page { size: A4; margin: 0; }
                        body { margin: 0; }
                        .print-container {
                            width: 210mm;
                            height: 297mm;
                            display: flex;
                            justify-content: center;
                            align-items: start;
                        }
                        .print-content {
                            max-width: calc(100% - 20px);
                            max-height: 100%;
                            margin:0 auto;
                            display:block;
                        }
                    </style>
                </head>
                <body>
                    <div class="print-container">
                        <img src="${dataURL}" class="print-content" />
                    </div>
                </body>
                </html>
            `);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };
    }

    const refresh = () => {
        window.location.href = window.location.href;
    }

    const painMessages = {
        0: "No Hurt",
        2: "Hurts Little Bit",
        4: "Hurts Little More",
        6: "Hurts Even More",
        8: "Hurts Whole Lot",
        10: "Hurts Worst"
    };
    const labels = [
        "No Hurt", "Hurts Little Bit", "Hurts Little More","Hurts even more", "Hurts Whole Lot","Hurts Worst"
      ];
    return (
        
        <form ref={formRef} className='patientform'>
            <div className="card py-3 mb-4 px-3">
            <h2 className='mb-5'>General Consent Form</h2>

            <h4 className='mb-4'>Fill One Input Field according to your requirements</h4>

                <div className="row">
                    <FormInput inputType="text" inputValue={emiratesNo} onInputChange={(e)=>setEmiratesNo(e.target.value)} label={"Emirate Number"} className="col-md-6" />
                    <FormInput inputType="text" inputValue={passportNo} onInputChange={(e)=>setPassportNo(e.target.value)} label={"passport Number"} className="col-md-6"/>
                </div>
                <div className="row">
                <FormInput inputType='text' inputValue={regno} onInputChange={(e) => setRegno(e.target.value)} label='reg.no' className='col-md-6' />

                    {/* <FormInput inputType="number" inputValue={dubaiNumber} onInputChange={(e)=>setDubaiNumber(e.target.value)} label={"Foreign Number"} className="col-md-6"/> */}
                </div>
            </div>
            <h4 className='mb-4'>General Information</h4>
            <div className='row'>
                <FormInput inputType='text' inputValue={name} onInputChange={(e) => setName(e.target.value)} label='name' className='col-md-6' />
                <FormInput inputType='number' inputValue={age} onInputChange={(e) => setAge(e.target.value)} label='age' className='col-md-6' />
            </div>
            <div className='row'>
                <FormInput inputType='email' inputValue={email} onInputChange={(e) => setEmail(e.target.value)} label='email' className='col-md-6' />
                <FormInput inputType='text' inputValue={contact} onInputChange={(e) => setContact(e.target.value)} label='contact' className='col-md-6' />
            </div>
            <div className='row'>
            <FormInput inputType='text' inputValue={nationality} onInputChange={(e) => setNationality(e.target.value)} label='Nationality' className='col-md-6' />

                <FormInput inputType='text' inputValue={emergencyPhone} onInputChange={(e) => setEmergencyPhone(e.target.value)} label='Emergency Phone #' className='col-md-6' />
            </div>
            <div className='row'>
                <FormInput inputType='text' inputValue={occupation} onInputChange={(e) => setOccupation(e.target.value)} label='Occupation' className='col-md-6' />
                <FormInput inputType='text' inputValue={refferdBy} onInputChange={(e) => setRefferdBy(e.target.value)} label='Reffered To Us By' className='col-md-6' />


            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <label>Consulting Dr</label>
                    <select onChange={(e) => setDoctor(e.target.value)}>
                        {doctorsDropDown&& doctorsDropDown.map(doc=><option value={doc.Id}>{doc.Name}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <h4 className='mb-3 mt-4'>medical health histroy</h4>
            </div>
            <div>
                <label>BLOOD PRESURE</label>
                <input type="checkbox"  checked = {bloodPresure} onChange={(e) => setBloodPresure(e.target.checked)} />
            </div>
            <div>
                <label>HEART PROBLEM</label>
                <input type="checkbox" checked={healthProblem} onChange={(e) => setHealthProblem(e.target.checked)} />
            </div>
            <div>
                <label>ALLERGY PROBLEMS</label>
                <input type="checkbox"  checked = {allergyProblems} onChange={(e) => setAllergyProblems(e.target.checked)} />
            </div>
            <div>
                <label>ASTHAMA</label>
                <input type="checkbox" checked={asthama} onChange={(e) => setAsthama(e.target.checked)} />
            </div>
            <div>
                <label>THYROID PROBLEM</label>
                <input type="checkbox" checked={thyroidProblems} onChange={(e) => setThyroidProblems(e.target.checked)} />
            </div>
            <div className='row mt-4'>
                <FormInput inputType='text' label='Any Other Medical Problem Please Specify' className='col-md-12' inputValue={anyOther} onInputChange={(e) => setAnyOther(e.target.value)} />
                <FormInput inputType='text' label='During The-Past 12 Months Are You On Any Medication/Treatment?' className='col-md-12' inputValue={medication} onInputChange={(e) => setMedication(e.target.value)} />
            </div>
            <div className='mb-4'>
                <label>ARE YOU PREGNANT? (For Women Only)</label>
                <input type="checkbox" checked={pregnant} onChange={(e) => setPregnant(e.target.checked)} />
            </div>
            <div className="mt-3 mb-4">
                <label htmlFor="textarea">initial statement</label>
                <br></br>
                <textarea className="form-control"  rows={5} placeholder="Describe Your Initial Statement" value={initialStatement} onChange={(e) => setInitialStatement(e.target.value)} />

            </div>
            <br />
            
      <h2 className="text-xl font-bold  mb-5">Pain Measurement Scale</h2>
     <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "10px" }}>
        {labels.map((label, index) => (
          <span key={index} style={{ flex: 1, textAlign: "center", fontSize: "14px" }}>{label}</span>
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
            <p className="mt-4 text-lg font-medium">Selected: {painScale} - {painMessages[painScale]}</p>
    
            <br />

            <SignaturePad ref={sigCanvas} />
            <div className='d-flex'>
                <button type="button" className='butn mt-4 mr-4' disabled={printDisabled} onClick={printForm}>Print</button>
                <button type="button" className='butn-sec mt-4 ' onClick={saveForm}>Save</button>
                <button type="button" className='butn-sec mt-4 ml-auto' onClick={refresh}>New</button>
            </div>
            {/* <img src={dataURL}/> */}
        </form>
    );
}

export default Forms;
