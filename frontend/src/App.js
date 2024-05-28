import React from 'react'
import './App.css'
// import {Row, Col} from 'react-bootstrap'
// import UserMenu from './components/UserMenu'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import MainScreen from './Screens/MainScreen';
import AgentsScreen from './Screens/AgentsScreen';
import AddAgentScreen from './Screens/AddAgentScreen';
import AddEmployeeScreen from './Screens/AddEmployeeScreen';
import WeeklyAgentsScreen from './Screens/WeeklyAgentsScreen';
import SendMailScreen from './Screens/SendMailScreen';
import EmployeesScreen from './Screens/EmployeesScreen';

const App = () => {
  return (
    // <div>
    //   <Row>
    //     <Col md={2}>
    //       <UserMenu />
    //     </Col>
    //     <Col md={10}>
    //       hey
    //     </Col>
    //   </Row>
    // </div>
    <Router>
      <Routes>
        <Route exact path="/" element={<MainScreen />} />
        <Route exact path="/agents" element={<AgentsScreen />} />
        <Route exact path="/agents/add" element={<AddAgentScreen />} />
        <Route exact path="/agents/per-week" element={<WeeklyAgentsScreen />} />
        <Route exact path="/employees" element={<EmployeesScreen />} />
        <Route exact path="/send-mail" element={<SendMailScreen />} />
        <Route exact path="/employees/add" element={<AddEmployeeScreen />} />
      </Routes>
    </Router>
  )
}

export default App
