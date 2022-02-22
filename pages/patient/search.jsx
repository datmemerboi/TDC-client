import Head from 'next/head';
import { Fragment, useState, useEffect } from 'react';

import api from '../../utils/api.js';
import NavBar from '../../components/navbar.jsx';
import { tableRowFromPatientList } from '../../components/common';

export default function PatientSearch() {
  /**
   * Page to render search patients
   *
   * @version 1.2.2
   * @route /patient/search
   */
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('Name');
  const [result, setResult] = useState([]);

  useEffect(async () => {
    if (keyword.length && keyword.length > 2 && type.length) {
      let { data } = await api.searchPatient(keyword, type);
      if (data) {
        setResult(data.docs);
      }
    }
  }, [keyword, type]);

  const handleInput = (e) => {
    let { value } = e.target;
    setKeyword(value);
  };

  return (
    <Fragment>
      <Head>
        <title>Search a patient</title>
      </Head>
      <NavBar />
      <div className="container">
        <div className="center-of-page">
          <input type="text" className="input-bar" onInput={handleInput} placeholder="Search" />
          <br style={{ userSelect: 'none' }} />
          <table>
            <tbody>
              <tr>
                <td
                  className={type === 'Name' ? 'chosen-one' : null}
                  onClick={() => setType('Name')}
                >
                  Name
                </td>
                <td
                  className={type === 'Area' ? 'chosen-one' : null}
                  onClick={() => setType('Area')}
                >
                  Area
                </td>
                <td
                  className={type === 'Contact' ? 'chosen-one' : null}
                  onClick={() => setType('Contact')}
                >
                  Contact
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
            {result && result.length ? (
              <tbody>{tableRowFromPatientList(result)}</tbody>
            ) : (
              <tbody></tbody>
            )}
          </table>
        </div>
      </div>
    </Fragment>
  );
}
