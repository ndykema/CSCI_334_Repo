import { useEffect, useState } from 'react';
import banner from './assets/banner.png';
import './Index.css';
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Create from "./pages/Create"; 
import Dashboard from "./pages/Dashboard";


function App() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetching data from the .NET backend
        fetch('http://localhost:5160/api/tasks')
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Backend not running?", err));
    }, []);

    return (
       
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>

            <div className="banner-container">
                <div className="banner-left">
                    <img src={banner} alt="Banner-image" className="banner-image"></img>
                </div>
                <div className="banner-right">
                    
                    <ul>
                        <h3>Navigation Menu</h3>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/help">Help</Link></li>
                        <li><Link to="/account">Create An Account </Link></li>
                        <li><Link to="/login">Log In</Link></li>
                    </ul>
                </div>
                <div className="banner-spacer"></div>
            </div>


            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/help" element={<Help />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Create />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>

        </div>
    );
}

export default App; 