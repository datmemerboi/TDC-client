import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import logo from '../icons/logo.png';

export default function NavBar() {
  const [current, setCurrent] = useState(null);
  return (
    <React.Fragment>
      <nav>
        <a href="/"><img src={logo} className="logo" alt="Logo" /></a>
        <div className="nav-item-container">
          <div onMouseEnter={() => {setCurrent("Patient");}} onMouseLeave={() => {setCurrent(null);}}>
            <a href="/patient">
              <p className={current === "Patient" ? "Bld chosen-one" : "Bld"}>Patients</p>
            </a>
          </div>
          <div onMouseEnter={() => {setCurrent("Treatment");}} onMouseLeave={() => {setCurrent(null);}}>
            <a href="/treatment">
              <p className={current === "Treatment" ? "Bld chosen-one" : "Bld"}>Treatments</p>
            </a>
          </div>
          <div onMouseEnter={() => {setCurrent("Calendar");}} onMouseLeave={() => {setCurrent(null);}}>
            <a href="/calendar">
              <p className={current === "Calendar" ? "Bld chosen-one" : "Bld"}>Calendar</p>
            </a>
          </div>
          <div onMouseEnter={() => {setCurrent("Invoice");}} onMouseLeave={() => {setCurrent(null);}}>
            <a href="/invoice">
              <p className={current === "Invoice" ? "Bld chosen-one" : "Bld"}>Invoices</p>
            </a>
          </div>
        </div>
      </nav>
      <br/>
    </React.Fragment>
  )
};
