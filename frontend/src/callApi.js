const BASE_URL = 'http://localhost:3001/api';

const CallApi = async (endpoint, callType = 'GET', data = null) => {
    try {
        const url = `${BASE_URL}/${endpoint}`;
        const token = localStorage.getItem('token');
        
        const headers = {
            'Content-Type': 'application/json'
        };

        // Add authorization token if provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let options = {
            method: callType,
            headers: headers
        };

        // Add data as query parameters for GET requests
        if (callType === 'GET') {
            if (data) {
                const queryString = Object.keys(data)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
                    .join('&');
                url = `${url}?${queryString}`;
            }
        } else if (callType === 'POST') {
            // Add data as request body for POST requests
            options.body = JSON.stringify(data);
        } else {
            throw new Error(`Unsupported call type: ${callType}`);
        }

        // Perform the fetch request
        const response = await fetch(url, options);

        if (!response.ok) {
            let msg = await response.text();
            if(msg == 'Invalid token'){
                delete window.localStorage.token;
                window.location.href = '/login';
                return null;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
};

export default CallApi;
