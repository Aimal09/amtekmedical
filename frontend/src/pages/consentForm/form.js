import React, { useState, useRef } from 'react';
import CallApi from '../../callApi';
import FormInput from '../../components/textFields/formInput';
import './form.css'
import SignaturePad from '../../components/signaturePad/signaturePad';
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
    const [healthProblem, setHealthProblem] = useState('');
    const [bloodPresure, setBloodPresure] = useState('');
    const [allergyProblems, setAllergyProblems] = useState('');
    const [thyroidProblems, setThyroidProblems] = useState('');
    const [asthama, setAsthama] = useState('');
    const [anyOther, setAnyOther] = useState('');
    const [medication, setMedication] = useState('');
    const [pregnant, setPregnant] = useState('');

    const [dataURL, setDataURL] = useState('');
    const [printDisabled, setPrintDisabled] = useState(true);
    const sigCanvas = useRef(null);
    const formRef = useRef(null);

    const saveForm = async () => {
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
        let signImg = document.createElement('img');
        signImg.src = sigCanvas.current.toDataURL();
        formHtml.querySelector('.signature-pad canvas.sigCanvas').replaceWith(signImg);

        html2canvas(formHtml).then(async (canvas) => {
            let _dataUrl = canvas.toDataURL();
            setDataURL(_dataUrl);
            document.body.removeChild(formHtml);
            let formEntryRes = await CallApi('AddFormEntry', 'POST', { formId: 1, formData: 'fd', formImageUrl: dataURL })
            let newId = formEntryRes?.newId;
            if (formEntryRes && newId)
                await CallApi('AddPatient', 'POST', { name, age, regno, contact, email, nationality, occupation, emergencyPhone, refferdBy, doctor, newId });
        });
        setPrintDisabled(false);
    }

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
    return (
        <form ref={formRef} className='patientform'>
            <h2 className='text-center mb-5'>General Consent Form</h2>
            <h4 className='mb-4'>General Information</h4>
            <div className='row'>
                <FormInput inputType='text' inputValue={name} onInputChange={(e) => setName(e.target.value)} label='name' className='col-md-6' />
                <FormInput inputType='number' inputValue={age} onInputChange={(e) => setAge(e.target.value)} label='age' className='col-md-6' />
            </div>
            <div className='row'>
                <FormInput inputType='text' inputValue={regno} onInputChange={(e) => setRegno(e.target.value)} label='reg.no' className='col-md-6' />
                <FormInput inputType='text' inputValue={contact} onInputChange={(e) => setContact(e.target.value)} label='contact' className='col-md-6' />
            </div>
            <div className='row'>
                <FormInput inputType='email' inputValue={email} onInputChange={(e) => setEmail(e.target.value)} label='email' className='col-md-6' />
                <FormInput inputType='text' inputValue={nationality} onInputChange={(e) => setNationality(e.target.value)} label='Nationality' className='col-md-6' />
            </div>
            <div className='row'>
                <FormInput inputType='text' inputValue={occupation} onInputChange={(e) => setOccupation(e.target.value)} label='Occupation' className='col-md-6' />
                <FormInput inputType='text' inputValue={emergencyPhone} onInputChange={(e) => setEmergencyPhone(e.target.value)} label='Emergency Phone #' className='col-md-6' />
            </div>
            <div className='row'>
                <FormInput inputType='text' inputValue={refferdBy} onInputChange={(e) => setRefferdBy(e.target.value)} label='Reffered To Us By' className='col-md-6' />
                <div className='col-md-6'>
                    <label>Consulting Dr</label>
                    <select onChange={(e) => setDoctor(e.target.value)}>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>
            </div>
            <div>
                <h4 className='mb-3 mt-4'>medical health histroy</h4>
            </div>
            <div>
                <label>HEART PROBLEM</label>
                <input type="checkbox" value={healthProblem} onChange={(e) => setHealthProblem(e.target.value)} />
            </div>
            <div>
                <label>BLOOD PRESURE</label>
                <input type="checkbox" value={bloodPresure} onChange={(e) => setBloodPresure(e.target.value)} />
            </div>
            <div>
                <label>ALLERGY PROBLEMS</label>
                <input type="checkbox" value={allergyProblems} onChange={(e) => setAllergyProblems(e.target.value)} />
            </div>
            <div>
                <label>THYROID PROBLEM</label>
                <input type="checkbox" value={thyroidProblems} onChange={(e) => setThyroidProblems(e.target.value)} />
            </div>
            <div>
                <label>ASTHAMA</label>
                <input type="checkbox" value={asthama} onChange={(e) => setAsthama(e.target.value)} />
            </div>
            <div className='row mt-4'>
                <FormInput inputType='text' label='Any Other Medical Problem Please Specify' className='col-md-12' inputValue={anyOther} onChange={(e) => setAnyOther(e.target.value)} />
                <FormInput inputType='text' label='During The-Past 12 Months Are You On Any Medication/Treatment?' className='col-md-12' inputValue={medication} onChange={(e) => setMedication(e.target.value)} />
            </div>
            <div className='mb-4'>
                <label>ARE YOU PREGNANT? (For Women Only)</label>
                <input type="checkbox" value={pregnant} onChange={(e) => setPregnant(e.target.value)} />
            </div>
            <SignaturePad ref={sigCanvas} />
            <div className='d-flex'>
                <button type="button" className='butn-sec mt-4 mr-4' onClick={saveForm}>Save</button>
                <button type="button" className='butn mt-4' disabled={printDisabled} onClick={printForm}>Print</button>
                <button type="button" className='butn-sec mt-4 ml-auto' onClick={refresh}>New</button>
            </div>
            {/* <img src={dataURL}/> */}
        </form>
    );
}

export default Forms;
