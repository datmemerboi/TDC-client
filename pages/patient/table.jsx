import { Fragment, useState, useEffect } from 'react';
import NavBar from '../../components/navbar';

import api from '../../utils/api';
import { tableRowFromPatientList } from '../../components/common';

export default function PatientsTable() {
  const [tableRows, setTableRows] = useState([]);

  useEffect(async () => {
    if (!tableRows.length) {
      let { data } = await api.fetchAllPatients();
      if (data) {
        setTableRows(data);
      }
    }
  }, []);

  return (
    <Fragment>
      <NavBar />
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
              {tableRows.length > 0 ? (
                tableRowFromPatientList(tableRows)
              ) : (
                <p style={{ textAlign: 'center' }}>No patients found.</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
}
