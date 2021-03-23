import React from 'react';

export default function PatientIndex(props) {

  return (
    <div className="container">
      <h2>Patient pages</h2>
      <ul>
          <li><a href="/patient/form/">New Patient</a></li>
          <li><a href="/patient/all/">All Patients</a></li>
          <li><a href="/patient/search/">Search Patient</a></li>
          <li><a href="/patient/edit/">Edit Patient</a></li>
      </ul>
    </div>
  );
}
