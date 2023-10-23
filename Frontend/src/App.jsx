import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DriveList from './Components/DriveList/DriveList.jsx';
import Login from './Components/Login/Login.jsx';
import "./app.css"
const App = () => {
    const [data, setData] = useState({ drives: [] });
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
    // const [isLoggedIn, setIsLoggedIn] = useState(true); // Track login status

    useEffect(() => {
        if (isLoggedIn) {
            // Fetch data from the server API only if logged in


            const regno = localStorage.getItem('regno'); // Get the regno from local storage

            axios
                .post('http://localhost:3000/api/action/getDrives', {
                    regno: regno,
                })
                .then((response) => {
                    setData(response.data);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [isLoggedIn]); // Run this effect whenever the login status changes

    const handleLogin = () => {
        // This function will be called by the Login component upon successful login
        console.log("succesfull login")
        setIsLoggedIn(true);
    };
    console.log(data.drives.length)

    return (
        <div>
            {!isLoggedIn && <Login onLogin={handleLogin} />} {/* Show login only if not logged in */}
            {isLoggedIn && (
                <div>
                    <h1>List of Drives</h1>
                    {data.drives && data.drives.length > 0 ? <DriveList drives={data.drives} /> : <p>Loading...</p>}

                </div>
            )}
        </div>
    );
};

export default App;
