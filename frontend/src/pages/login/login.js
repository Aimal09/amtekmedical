import React, { useState } from 'react';
import FormInput from "../../components/textFields/formInput";
import './login.css';

export default function Login() {
    const [username, setUsername] = useState('aimaljan');
    const [password, setPassword] = useState('Aimal@123');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.status === 200) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', JSON.stringify(data.userData?.role));
            localStorage.setItem('firstName', data.userData?.firstName);
            localStorage.setItem('lastName', data.userData?.lastName);
            // Redirect to the dashboard or another page
            window.location.href = '/dashboard';
        } else {
            setErrorMessage('Invalid username or password');
        }
    };
    return (
        <div className="login">
            <div className="loginform">
                <h1 className="text-center mb-4">Login</h1>
                <p className="text-center ">Enter your username and password.</p>
                <FormInput label="Username" placeholder="Enter your username" inputValue={username}
                    onInputChange={(e) => setUsername(e.target.value)}
                />
                <FormInput label="Password" inputType="password" placeholder="Enter your password" inputValue={password}
                    onInputChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                <button className="butn mt-3 w-100" onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
}