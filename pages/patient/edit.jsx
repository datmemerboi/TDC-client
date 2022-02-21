import Head from 'next/head';
import { Fragment, useState, useEffect } from 'react';

import api from '../../utils/api';
import Modal from '../../components/modal';
import NavBar from '../../components/navbar';

export default function PatientEdit() {
  /**
   * Page to render the edit-patient form
   *
   * @version 1.2.2
   * @route /patient/edit
   */
  const defaultState = {
    name: '',
    age: 1,
    gender: '',
    contact: 0,
    address: '',
    area: '',
    med_history: '',
    current_meds: ''
  };
  const [pid, setPid] = useState('');
  const [formData, setFormData] = useState(defaultState);
  const [modal, setModal] = useState({ show: false, message: null });

  useEffect(async () => {
    if (pid.length > 3) {
      const { data } = await api.getPatient(pid);
      if (Object.keys(data).length) {
        setFormData({
          ...formData,
          ...data
        });
      }
    }
  }, [pid]);

  const pidHandler = (e) => {
    setPid(e.target.value.trim().toUpperCase());
  };
  const handleInput = (e) => {
    let { name, value } = e.target;
    if ((name === 'age' || name === 'contact') && !isNaN(parseInt(value))) {
      value = parseInt(value);
    }
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async () => {
    let patientObj = Object.entries(formData).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val }),
      {}
    );

    if (!patientObj.name) {
      return setModal({ show: true, message: 'Patient name cannot be empty.' });
    }
    if (!patientObj.contact) {
      return setModal({ show: true, message: 'Patient contact cannot be empty.' });
    }

    let { error } = await api.updatePatient(pid, patientObj);
    if (error?.message) {
      return setModal({
        show: true,
        message: error.message
      });
    } else {
      return setModal({
        show: true,
        message: `Patient ${pid} updated.`
      });
    }
  };
  const toggleModal = () => {
    setModal({ show: !modal.show });
  };
  return (
    <Fragment>
      <Head>
        <title>Edit existing patient</title>
      </Head>
      <NavBar />
      <div className="container">
        <div className="hold-together">
          <div className="left-column">
            <div>
              <label>
                <strong>Patient ID</strong>
              </label>
              <br />
              <input
                type="text"
                className="input-bar small-input-bar"
                onChange={pidHandler}
                name="p_id"
                value={pid}
              />
            </div>
            <div>
              <label>
                <strong>Name</strong>
              </label>
              <br />
              <input
                type="text"
                className="input-bar"
                name="name"
                value={formData.name}
                onChange={handleInput}
                required
              />
            </div>
            <div>
              <label>Age</label>
              <br />
              <input
                type="number"
                min={1}
                className="input-bar small-input-bar"
                name="age"
                value={formData.age}
                onChange={handleInput}
              />
            </div>
            <div>
              <label>Gender</label>
              <br />
              <select
                className="input-select"
                name="gender"
                value={formData.gender}
                onChange={handleInput}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div>
              <label>
                <strong>Contact</strong>
              </label>
              <br />
              <input
                type="tel"
                className="input-bar"
                name="contact"
                value={formData.contact}
                onChange={handleInput}
              />
            </div>
            <div>
              <label>Area</label>
              <br />
              <input
                type="text"
                className="input-bar"
                name="area"
                value={formData.area}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="right-column">
            <div>
              <label>Address</label>
              <br />
              <textarea
                className="input-area"
                name="address"
                value={formData.address ?? ''}
                onChange={handleInput}
              />
            </div>
            <div>
              <label>Medical History</label>&nbsp;
              <label style={{ fontSize: 12 }}>(Comma separated)</label>
              <br />
              <textarea
                className="input-area"
                name="med_history"
                value={formData.med_history ?? ''}
                onChange={handleInput}
              />
            </div>
            <div>
              <label>Current Medicines</label>&nbsp;
              <label style={{ fontSize: 12 }}>(Comma separated)</label>
              <br />
              <textarea
                className="input-area"
                name="current_meds"
                value={formData.current_meds ?? ''}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <button className="primary" onClick={handleSubmit}>
            SUBMIT
          </button>
        </div>
      </div>
      <Modal show={modal.show} handleClick={toggleModal}>
        <h3>{modal.message}</h3>
      </Modal>
    </Fragment>
  );
}
