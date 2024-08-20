import React, { useEffect, useState } from "react";
import Calendar from "../../components/calendar/calendar";
import CallApi from "../../callApi";
import moment from 'moment';
import Popup from "../../components/popup";
import DatePicker from "react-multi-date-picker";
import './appointment.css'

export default function Appointments() {

    const [schedules, setSchedules] = useState([]);

    const [selectedWeek, setSelectedWeek] = useState(moment().format('YYYY-[W]W'));
    const [appointmentData, setAppointmentData] = useState([]);
    const [dates, setDates] = useState();
    const [popup, setPopup] = useState(false);
    const [doctors, setDoctors] = useState();
    const [patients, setPatients] = useState();
    const [doctorId, setDoctorId] = useState();
    const [patientId, setPatientId] = useState();
    const [appointmentDate, setAppointmentDate] = useState('2024-08-12');
    const [startTime, setStartTime] = useState(moment().format('HH:00'));
    const [endTime, setEndTime] = useState(moment().add(1, 'hours').format('HH:00'));
    const [errorMsg, setErrorMsg] = useState();
    const [showFilters, setShowFilters] = useState();

    const _schedules = [];
    useEffect(() => {
        const fetchData = async () => {
            const [fetchedDoctors, fetchedPatients] = await Promise.all([
                CallApi('GetAllDoctor'),
                CallApi('GetPatients')
            ]);
            setDoctors(fetchedDoctors);
            setPatients(fetchedPatients);
        };
        if (!doctors && !patients)
            fetchData();
        handleWeekChange(moment().format('YYYY-[W]W'));
    }, [doctors, patients]);

    useEffect(() => {
        setCalendar();
    }, [appointmentData]);


    useEffect(() => {
        fetchAppointmentData();
    }, [dates]);

    const fetchAppointmentData = async () => {
        const [year, weekNumber] = selectedWeek.split('-W');
        const startDate = moment().year(year).week(weekNumber).startOf('week').format('YYYY-MM-DD');
        const endDate = moment().year(year).week(weekNumber).endOf('week').format('YYYY-MM-DD');
        const _schedules = await CallApi('GetAppointmentsByDate', 'GET', { startDate, endDate });
        console.log(_schedules)
        setAppointmentData(_schedules);
    }

    const setCalendar = () => {
        dates && dates.forEach(d => {
            const appointments = appointmentData && appointmentData.filter(f => { return moment.utc(f.AppointmentDate).date() == d });
            const appointmentObj = {};
            appointments && appointments.forEach(ap => {
                const _start = moment(ap.AppointmentDate + ' ' + ap.StartTime);
                const _end = moment(ap.AppointmentDate + ' ' + ap.EndTime);

                const index = _start.hour();
                const title = ap.DoctorName;
                const startTime = (_start.minute() / 60) * 100;
                const endTime = (startTime + (_end.diff(_start, 'minutes') / 60) * 100);
                if (!appointmentObj.hasOwnProperty(index)) appointmentObj[index] = [];
                appointmentObj[index].push({ title, startTime, endTime });
            })

            _schedules.push({ date: d, ...appointmentObj });
        });
        setSchedules(_schedules);
    }
    const handleWeekChange = (value) => {
        setSelectedWeek(value);
        if (value) {
            const [year, weekNumber] = value.split('-W');

            const firstDayOfWeek = moment().year(year).week(weekNumber).startOf('week');
            const weekDates = Array.from({ length: 7 }, (_, i) =>
                firstDayOfWeek.clone().add(i, 'days').date()
            );

            setDates(weekDates);
        }
    };

    async function addAppointment() {
        console.log({ doctorId, patientId, appointmentDate, startTime, endTime })
        const res = await CallApi('AddAppointment', 'POST', { doctorId, patientId, appointmentDate, startTime, endTime }, true);
        alert(res);
        if(res === 'Success'){
            fetchAppointmentData();
            setPopup(false);
        }
        else{
            setErrorMsg(res);
        }
    }
    return (
        <div className="appointment-calendar">
            <div className="tools d-flex justify-content-between mb-3 mt-3 px-3">
                {popup && <Popup title="Add Appointment" buttonText="Save" onPopupClose={() => setPopup(false)} onButtonClick={addAppointment}>
                    <div>
                        {errorMsg&&<p className="error-msg">{errorMsg}</p>}
                        <div className="form-group">
                            <label>doctor</label>
                            <select className="form-control" onChange={(e) => setDoctorId(e.target.value)} value={doctorId}>
                                <option value={0}>Select Docter</option>
                                {doctors && doctors.map((doc, i) => <option key={i} value={doc.Id}>{doc.Name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>patient</label>
                            <select className="form-control" onChange={(e) => setPatientId(e.target.value)} value={patientId}>
                                <option value={0}>Select Patient</option>
                                {patients && patients.map((pat, i) => <option key={i} value={pat.Id}>{pat.Name}</option>)}
                            </select>
                        </div>
                        <div className="form-group d-flex flex-column">
                            <label>date</label>
                            <DatePicker inputClass="form-control" value={appointmentDate} onChange={(e) => setAppointmentDate(moment(e.toDate()).format('YYYY-MM-DD'))} />
                        </div>
                        <div className="d-flex">
                            <div className="form-group d-flex flex-column w-100 mr-1">
                                <label>startTime</label>
                                <input className="form-control w-100" type="time" step={300} onChange={(e)=> setStartTime(e.target.value)}/>
                            </div>
                            <div className="form-group d-flex flex-column w-100 ml-1">
                                <label>endTime</label>
                                <input className="form-control w-100" type="time" step={300} onChange={(e)=> setEndTime(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                </Popup>}
                <div className="datePicker">
                    <input type="week" className="form-control" value={selectedWeek} onChange={(e) => handleWeekChange(e.target.value)} />
                </div>
                <button className="butn" onClick={() => setPopup(true)}>
                    Add Appointment
                </button>
                <div className="doctor-filters d-flex flex-column justify-content-center">
                    <span className="butn-sec" onClick={e=>setShowFilters(!showFilters)}>Filter Docters</span>
                    {showFilters&&<div className="doctors">
                        {doctors&&doctors.map(doctor=><p><input type="checkbox" id={doctor.Id}/> <label for={doctor.Id}>{doctor.Id} {doctor.Name}</label></p>)}
                        <span className="butn d-block mx-auto mt-3 text-center">Apply</span>
                    </div>}
                </div>
            </div>

            <Calendar schedules={schedules} />
        </div>

    )
}