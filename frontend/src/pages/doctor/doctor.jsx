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

    const handleDelete = async (doctorId) => {
        try {
            await CallApi(`doctor/deletedoctor/${doctorId}`, 'PUT');
            alert('Doctor deactivated successfully');
            // 🔄 Refresh doctor list after deactivation
            const updatedData = await CallApi('GetAllDoctor');
            setDoctorList(updatedData);
            setFilteredDoctorList(updatedData);
        } catch (error) {
            console.error('Failed to deactivate doctor', error);
            alert('Failed to deactivate doctor');
        }
    };
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
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Available Days</th>
                        <th>Available Hours</th>
                        <th>Exceptional Dates</th>
                        <th>Department Of Doctor</th>
                        <th>Action</th> {/* 🔥 New column */}
                    </tr>
                    </thead>
                    <tbody>
                        {filteredDoctorList.map((row, index) => (
                            <tr key={index}>
                                <td>{row.Name}</td>
                                <td>{row.Email}</td>
                                <td>{row.Contact}</td>
                                <td>{row.AvailableDays}</td>
                                <td>{row.AvailableHours}</td>
                                <td>{row.ExceptionalDates}</td>
                                <td>{row.departmentOfDoctor}</td>
                                <td> <button onClick={()=>handleDelete(row.id)} > Delete Doctor </button> </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}