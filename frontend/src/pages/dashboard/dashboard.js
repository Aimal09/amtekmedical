import React, {useState} from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './dashboard.css';
import logo from '../../assets/images/amtekmedicallogo.png'

function Dashboard() {
    const [toggleAside, setToggleAside] = useState(false);
    return (
        <div className="dashboard-container">
            <aside>
                <span className={'togglebutn ' + (toggleAside && 'open')} onClick={(e)=> setToggleAside(!toggleAside)}><i className="far fa-chevron-right"></i></span>
                <ul className='navlinks text-center'>
                    <li><NavLink to="form" className={({ isActive }) => (isActive ? "active" : "")}><i className="fal fa-file-medical-alt"></i> Consent Form</NavLink></li>
                    <li><NavLink to="patients" className={({ isActive }) => (isActive ? "active" : "")}><i className="fal fa-hospital-user"></i> Patient List</NavLink></li>
                    <li><NavLink to="addDoctor" className={({ isActive }) => (isActive ? "active" : "")}><i className="fal fa-hospital-user"></i> Add Doctor</NavLink></li>
                    <li><NavLink to="doctors" className={({ isActive }) => (isActive ? "active" : "")}><i className="fal fa-hospital-user"></i> Doctor List</NavLink></li>
                    <li><NavLink to="/calendar" className={({ isActive }) => (isActive ? "active" : "")}><i className="fal fa-hospital-user"></i> Calendar</NavLink></li>
                </ul>
            </aside>

            <nav className='d-flex'>
                <div className='d-flex justify-content-between align-items-center w-100'>
                    <img src={logo} className='img-fluid h-100'/>

                    <div className='user-info'>
                        <span>{window.localStorage.getItem('firstName')} {window.localStorage.getItem('lastName')}</span>
                    </div>
                </div>
            </nav>

            <div className='content'>
                <Outlet />
            </div>

        </div>
    );
}

export default Dashboard;
