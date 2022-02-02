import { Fragment, useState, useEffect } from 'react';
import NavBar from '../../components/navbar';

import api from '../../utils/api';
import { tableRowFromPatientList } from '../../components/common';

export default function PatientTable() {
  const [tableRows, setTableRows] = useState([]);

  useEffect(async () => {
    if (!tableRows.length) {
      let { data } = await api.fetchAllPatients();
      if (data && data.docs && data.docs.length) {
        setTableRows(data.docs);
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
            <tbody>{tableRows.length > 0 ? tableRowFromPatientList(tableRows) : null}</tbody>
          </table>
        </div>
        {tableRows.length ? null : <p style={{ textAlign: 'center' }}>No patients found.</p>}
      </div>
    </Fragment>
  );
}
