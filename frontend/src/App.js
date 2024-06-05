import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import ConfirmedMailingAgentsScreen from './Screens/ConfirmedMailingAgentsScreen';
import SendMailingScreen from './Screens/SendMailingScreen';
import RemoveMailingScreen from './Screens/RemoveMailingScreen';


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

  // Render routes only if authenticated
  return (
    <Router>
      <RenderRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
};

const RenderRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const { pathname } = location;

  if (!isAuthenticated) {
    if (pathname === "/agents/remove-mailing") {
      return <RemoveMailingScreen />;
    } else {
      return <LoginScreen setIsAuthenticated={setIsAuthenticated} />;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<MainScreen />} />
      <Route path="/agents" element={<AgentsScreen />} />
      <Route path="/agents/add" element={<AddAgentScreen />} />
      <Route path="/agents/per-week" element={<WeeklyAgentsScreen />} />
      <Route path="/agents/confirmed-mailing" element={<ConfirmedMailingAgentsScreen />} />
      <Route path="/mailing" element={<SendMailingScreen />} />
      <Route path="/employees" element={<EmployeesScreen />} />
      <Route path="/send-mail" element={<SendMailScreen />} />
      <Route path="/employees/add" element={<AddEmployeeScreen />} />
      <Route path="/agents/remove-mailing" element={<RemoveMailingScreen />} />
    </Routes>
  );
};

export default App;
