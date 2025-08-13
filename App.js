import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/iLogin";
import SignUp from "./pages/Register";
import Header from "./components/HeaderLog"
import Dashboard from "./pages/Dasboard"

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/"  element={<Login />} />
        <Route path="/register" element={<SignUp/>}/>
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
