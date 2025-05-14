const BASE_URL = process.env.API_BASE_URL

const CallApi = async (endpoint, callType = 'GET', data = null, resultAsText = false) => {
    try {
        let url = `${BASE_URL}/${endpoint}`;
        const token = localStorage.getItem('token');
        
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let options = {
            method: callType,
            headers: headers
        };

        if (callType === 'GET') {
            if (data) {
                const queryString = Object.keys(data)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
                    .join('&');
                url = `${url}?${queryString}`;
            }
        } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(callType)) {
            if (data) {
                options.body = JSON.stringify(data);
            }
        } else {
            throw new Error(`Unsupported call type: ${callType}`);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            let msg = await response.text();
            if (msg == 'Invalid token') {
                delete window.localStorage.token;
                window.location.href = '/login';
                return null;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return resultAsText ? await response.text() : await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
};

export default CallApi;

