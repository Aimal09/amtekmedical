import React, { useState, useEffect } from "react";
import FormInput from "../../components/textFields/formInput";
import CallApi from "../../callApi";

export default function AddDoctor() {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [availableDays, setAvailableDays] = useState('');
    const [availableHours, setAvailableHours] = useState('');
    const [exceptionalDates, setExceptionalDates] = useState('');
    // const [departments, setDepartments] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    
    // 🔹 Doctor Department List for Dropdown
    const [departments, setDepartments] = useState([]);

    // 🔹 Available Days Checkboxes
    const [mon, setMon] = useState(false);
    const [tue, setTue] = useState(false);
    const [wed, setWed] = useState(false);
    const [thur, setThur] = useState(false);
    const [fri, setFri] = useState(false);
    const [sat, setSat] = useState(false);
    const [sun, setSun] = useState(false);

    // ✅ Fetch Departments from API
    useEffect(() => {
        const fetchDepartments = async () => {
            let response = await CallApi('doctor-departments', 'GET');
            if (response) {
                setDepartments(response);
            }
        };
        fetchDepartments();
    }, []);
    // ✅ Save Form
    const saveForm = async () => {
        let _availableDays = `${mon ? "Mon," : ""}${tue ? "Tue," : ""}${wed ? "Wed," : ""}${thur ? "Thur," : ""}${fri ? "Fri," : ""}${sat ? "Sat," : ""}${sun ? "Sun," : ""}`;
        _availableDays = _availableDays.endsWith(",") ? _availableDays.slice(0, -1) : _availableDays;  // 🔹 Remove trailing comma
    
        let _selectedDepartments = selectedDepartments.join(", ");  // 🔹 Convert array to string
    
        try {
            let response = await CallApi('AddDoctor', 'POST', { 
                name, 
                contact, 
                email, 
                availableDays: _availableDays, 
                availableHours, 
                exceptionalDates, 
                departmentOfDoctor: _selectedDepartments // 🔹 Send as string
            });
    
            if (response) {
                alert('Doctor Added Successfully!');
                refresh();
            } else {
                alert('Failed to Add Doctor');
            }
        } catch (error) {
            console.error("Error saving doctor:", error);
        }
    };
    
    // ✅ Refresh Form
    const refresh = () => {
        setName('');
        setContact('');
        setEmail('');
        setAvailableDays('');
        setAvailableHours('');
        setExceptionalDates('');
        setSelectedDepartments([]);
        
        setMon(false);
        setTue(false);
        setWed(false);
        setThur(false);
        setFri(false);
        setSat(false);
        setSun(false);
    };

    const handleSelectChange = (event) => {
        const value = event.target.value;
        setSelectedDepartments((prevSelected) =>
            prevSelected.includes(value)
                ? prevSelected.filter((dept) => dept !== value) // Remove if already selected
                : [...prevSelected, value] // Add new selection
        );
    };

    return (
        <form>
            <h2 className='mb-5'>Add Doctor</h2>
            <h4 className='mb-4'>Doctor Information</h4>
            <div className='row'>
                <FormInput inputType='text' inputValue={name} onInputChange={(e) => setName(e.target.value)} label='Doctor Name' className='col-md-6' />
                <FormInput inputType='text' inputValue={contact} onInputChange={(e) => setContact(e.target.value)} label='Contact Number' className='col-md-6' />
            </div>
            <div className='row'>
                <div className="col-md-6 d-flex flex-column justify-content-center">
                    <label className="mb-3">Available Days {availableDays}</label>
                    <div className="d-flex align-items-center mb-3">
                        <div>
                            <label className="m-0 mr-2">Mon</label>
                            <input type='checkbox' checked={mon} onChange={(e) => setMon(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2">Tue</label>
                            <input type='checkbox' checked={tue} onChange={(e) => setTue(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2">Wed</label>
                            <input type='checkbox' checked={wed} onChange={(e) => setWed(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2">Thur</label>
                            <input type='checkbox' checked={thur} onChange={(e) => setThur(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2">Fri</label>
                            <input type='checkbox' checked={fri} onChange={(e) => setFri(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2">Sat</label>
                            <input type='checkbox' checked={sat} onChange={(e) => setSat(e.target.checked)} />
                        </div>
                        <div>
                            <label className="m-0 ml-3 mr-2">Sun</label>
                            <input type='checkbox' checked={sun} onChange={(e) => setSun(e.target.checked)} />
                        </div>
                    </div>
                </div>
                <FormInput inputType='email' inputValue={email} onInputChange={(e) => setEmail(e.target.value)} label='Email Address' className='col-md-6' />
            </div>
            <div className='row'>
                <FormInput inputType='text' inputValue={availableHours} onInputChange={(e) => setAvailableHours(e.target.value)} label='Available Hours (ex: 09:30-12:30)' className='col-md-6' />
                <FormInput inputType='date' inputValue={exceptionalDates} onInputChange={(e) => setExceptionalDates(e.target.value)} label='Exception Date' className='col-md-6' />
            </div>
            <div className='row'>
                {/* 🔹 Doctor Department Dropdown */}
                <div className='col-md-6'>
                <label className="mb-2">Department of Doctor</label>
            <select multiple className="form-control" value={selectedDepartments} onChange={handleSelectChange}>
                {departments.map((dept) => (
                    <option key={dept.Id} value={dept.DepartmentName}>
                        {selectedDepartments.includes(dept.DepartmentName) ? "✔ " : ""}{dept.DepartmentName}
                    </option>
                ))}
            </select>
            <p>Selected: {selectedDepartments.join(", ")}</p>

                </div>
            </div>
            <div className='d-flex'>
                <button type="button" className='butn mt-4 mr-4' onClick={saveForm}>Save</button>
                <button type="button" className='butn-sec mt-4 ml-auto' onClick={refresh}>New</button>
            </div>
        </form>
    );
}
