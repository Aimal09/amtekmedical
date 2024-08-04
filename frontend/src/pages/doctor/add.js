import React, { useState } from "react";
import FormInput from "../../components/textFields/formInput";
import CallApi from "../../callApi";

export default function AddDoctor() {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [availableDays, setAvailableDays] = useState('');
    const [availableHours, setAvailableHours] = useState('');
    const [exceptionalDates, setExceptionalDates] = useState('');

    const [mon, setMon] = useState(false);
    const [tue, setTue] = useState(false);
    const [wed, setWed] = useState(false);
    const [thur, setThur] = useState(false);
    const [fri, setFri] = useState(false);
    const [sat, setSat] = useState(false);
    const [sun, setSun] = useState(false);

    const saveForm = async () => {
        let _availableDays = `${mon?",mon":""}${tue?",tue":""}${wed?",wed":""}${thur?",thur":""}${fri?",fri":""}${sat?",sat":""}${sun?",sun":""}`;
        _availableDays = _availableDays.indexOf(',') === 0 ? _availableDays.slice(1): _availableDays;
        setAvailableDays(_availableDays);
        let response = await CallApi('AddDoctor', 'POST', { name, contact, email, availableDays, availableHours, exceptionalDates });
        if (response) {
            alert('SUCCESS...');
            refresh();
        }
        else {
            alert('FAILED...')
        }
    }

    const refresh = () => {
        window.location.href = window.location.href;
        
        setName("");
        setContact('');
        setEmail('');
        setAvailableDays('');
        setAvailableHours('');

        setMon(false);
        setTue(false);
        setWed(false);
        setThur(false);
        setFri(false);
        setSat(false);
        setSun(false);
    }
    return (
        <form>
            <h2 className='text-center mb-5'>Add Doctor</h2>
            <h4 className='mb-4'>Doctor Information</h4>
            <div className='row'>
                <FormInput inputType='text' inputValue={name} onInputChange={(e) => setName(e.target.value)} label='Doctor Name' className='col-md-6' />
                <FormInput inputType='text' inputValue={contact} onInputChange={(e) => setContact(e.target.value)} label='Contact Number' className='col-md-6' />
            </div>
            <div className='row'>
                <FormInput inputType='email' inputValue={email} onInputChange={(e) => setEmail(e.target.value)} label='email address' className='col-md-6' />
                {/* <FormInput inputType='text' inputValue={availableDays} onInputChange={(e) => setAvailableDays(e.target.value)} label='Avaialable Days (ex: mon,tue,wed,thur,fri,sat,sun)' className='col-md-6' /> */}
                <div className="col-md-6 d-flex flex-column justify-content-center">
                    <label className="mb-3">Available Days {availableDays}</label>
                    <div className="d-flex align-items-center mb-3">
                        <div>
                            <label className="m-0 mr-2" htmlFor="mon">Mon</label>
                            <input type='checkbox'value={mon} id="mon" onChange={(e) => setMon(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2" htmlFor="tue">Tue</label>
                            <input type='checkbox'value={tue} id="tue" onChange={(e) => setTue(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2" htmlFor="wed">Wed</label>
                            <input type='checkbox'value={wed} id="wed" onChange={(e) => setWed(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2" htmlFor="thur">Thur</label>
                            <input type='checkbox'value={thur} id="thur" onChange={(e) => setThur(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2" htmlFor="fri">Fri</label>
                            <input type='checkbox'value={fri} id="fri" onChange={(e) => setFri(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2" htmlFor="sat">Sat</label>
                            <input type='checkbox'value={sat} id="sat" onChange={(e) => setSat(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2" htmlFor="sun">Sun</label>
                            <input type='checkbox'value={sun} id="sun" onChange={(e) => setSun(e.target.checked)} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <FormInput inputType='text' inputValue={availableHours} onInputChange={(e) => setAvailableHours(e.target.value)} label='Available Hours (ex: 0930-1230 or 0900,1000,1200)' className='col-md-6' />
                <FormInput inputType='date' inputValue={exceptionalDates} onInputChange={(e) => setExceptionalDates(e.target.value)} label='Exception Date' className='col-md-6' />
            </div>
            <div className='d-flex'>
                <button type="button" className='butn mt-4 mr-4' onClick={saveForm}>Save</button>
                <button type="button" className='butn-sec mt-4 ml-auto' onClick={refresh}>New</button>
            </div>
            {/* <img src={dataURL}/> */}
        </form>
    )
}