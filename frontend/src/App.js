import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainScreen from './Screens/MainScreen';
import AgentsScreen from './Screens/AgentsScreen';
import AddAgentScreen from './Screens/AddAgentScreen';
import AddEmployeeScreen from './Screens/AddEmployeeScreen';
import WeeklyAgentsScreen from './Screens/WeeklyAgentsScreen';
import SendMailScreen from './Screens/SendMailScreen';
import EmployeesScreen from './Screens/EmployeesScreen';
import LoginScreen from './Screens/LoginScreen';
import Loader from './components/Loader';
import './App.css'


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false); 
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <LoginScreen setIsAuthenticated={setIsAuthenticated} />;
  }

  // Render routes only if authenticated
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/agents" element={<AgentsScreen />} />
        <Route path="/agents/add" element={<AddAgentScreen />} />
        <Route path="/agents/per-week" element={<WeeklyAgentsScreen />} />
        <Route path="/employees" element={<EmployeesScreen />} />
        <Route path="/send-mail" element={<SendMailScreen />} />
        <Route path="/employees/add" element={<AddEmployeeScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
