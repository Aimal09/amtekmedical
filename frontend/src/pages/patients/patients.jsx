import React, { useEffect, useState } from "react";
import CallApi from "../../callApi";
import FormInput from "../../components/textFields/formInput";

export default function Patients() {
    const [patientList, setPatientList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredPatientList, setFilteredPatientList] = useState([]);
    const [formImage, setFormImage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            let data = await CallApi('GetPatients');
            setPatientList(data);
            setFilteredPatientList(data);
        };

        fetchData();
    }, []);

    const search = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchValue(value);
        if (value) {
            const filteredList = patientList.filter((row) =>
                Object.values(row).some(val =>
                    String(val).toLowerCase().includes(value)
                )
            );
            setFilteredPatientList(filteredList);
        } else {
            setFilteredPatientList(patientList);
        }
    };

    const viewForm = (e)=>{
        setFormImage(e.target.dataset.img);
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="mb-4">Patients List</h3>
                <FormInput placeholder="Search" onInputChange={e=>search(e)}/>
            </div>
            <div className="table">

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Reg.No</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Nationality</th>
                            <th>Occupation</th>
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
                                <td>{row.RegNo}</td>
                                <td>{row.Contact}</td>
                                <td>{row.Email}</td>
                                <td>{row.Nationality}</td>
                                <td>{row.Occupation}</td>
                                <td>{row.EmergencyPhone}</td>
                                <td>{row.RefferedBy}</td>
                                <td>{row.DoctorId}</td>
                                <td><a data-img={row.FormImageUrl} onClick={(e)=>viewForm(e)}>view</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <img src={formImage}/>
            </div>
        </>
    );
}