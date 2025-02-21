import React, { useEffect, useState } from "react";
import CallApi from "../../callApi";
import FormInput from "../../components/textFields/formInput";

export default function Docters() {
    const [doctorList, setDoctorList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredDoctorList, setFilteredDoctorList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let data = await CallApi('GetAllDoctor');
            setDoctorList(data);
            setFilteredDoctorList(data);
        };

        fetchData();
    }, []);

    const search = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchValue(value);
        if (value) {
            const filteredList = doctorList.filter((row) =>
                Object.values(row).some(val =>
                    String(val).toLowerCase().includes(value)
                )
            );
            setFilteredDoctorList(filteredList);
        } else {
            setFilteredDoctorList(doctorList);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="mb-4">Doctors List</h3>
                <FormInput placeholder="Search" onInputChange={e=>search(e)}/>
            </div>
            <div className="table">

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Avaialable Days</th>
                            <th>Avaialable Hours</th>
                            <th>exceptional Dates</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDoctorList.map((row, index) => (
                            <tr key={index}>
                                <td>{row.Name}</td>
                                <td>{row.Contact}</td>
                                <td>{row.Email}</td>
                                <td>{row.AvailableDays}</td>
                                <td>{row.AvailableHours}</td>
                                <td>{row.ExceptionalDates}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}