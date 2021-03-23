import React, { useState, useEffect } from 'react';
import { trFromPatList } from '../common';
const config = require('../../config.json')[process.env.NODE_ENV];

export default function PatientsTable() {
  const [tableBodyRows, setTableBodyRows] = useState([]);

  useEffect(() => {
    if(!tableBodyRows.length) {
      var url = process.env?.REACT_APP_ENVIRONMENT === "local"
        ? '/api/patient/all/'
        : config.API_URL + '/api/patient/all/';
      fetch(url)
        .then(res => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw res.status;
          }
        })
        .then(data => {
          setTableBodyRows([ ...tableBodyRows, trFromPatList(data.docs) ]);
        })
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="container">
      <div className="scrollable">
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Sex/Age</th>
              <th>Contact</th>
              <th>Area</th>
              <th>Medical History</th>
            </tr>
          </thead>
          <tbody>
            {tableBodyRows.length > 0 ? tableBodyRows : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};
