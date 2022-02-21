import dayjs from 'dayjs';
import Head from 'next/head';
import { Fragment, useState, useEffect } from 'react';

import api from '../../utils/api';
import config from '../../config.json';
import Modal from '../../components/modal';
import NavBar from '../../components/navbar';
import { arrangementFromTeethNumbering } from '../../components/common';

export default function TreatmentEdit() {
  /**
   * Page to render edit-treatment form
   *
   * @version 1.2.2
   * @route /treatment/edit
   */

  const defaultState = {
    p_id: '',
    procedure_done: '',
    teeth_number: [],
    treatment_date: dayjs(),
    doctor: config.DOCTORS[0],
    remarks: ''
  };

  const [tid, setTid] = useState('');
  const [formData, setFormData] = useState(defaultState);
  const [modal, setModal] = useState({ show: false, message: null });

  useEffect(async () => {
    if (tid.length > 3) {
      let { data } = await api.getTreatmentData(tid);
      if (Object.keys(data).length) {
        setFormData(data);
        console.log(data);
      }
    }
  }, [tid]);

  const handleInput = (e) => {
    let { name, value } = e.target;
    if (name === 'treatment_date') {
      value = new Date(value).valueOf();
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleToothSelection = (value) => {
    let newTeeth = parseInt(value);

    setFormData((prev) => {
      let previouslySelected = prev.teeth_number;
      let newlySelected = [...previouslySelected];

      if (previouslySelected.includes(newTeeth)) {
        newlySelected.splice(previouslySelected.indexOf(newTeeth), 1);
      } else {
        newlySelected.push(newTeeth);
      }

      return { ...prev, teeth_number: newlySelected.sort((a, b) => (a > b ? 1 : -1)) };
    });
  };

  const handleSubmit = async () => {
    let treatmentObj = Object.entries(formData).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val }),
      {}
    );

    if (!treatmentObj.p_id) {
      return setModal({ show: true, message: 'Patient ID cannot be empty.' });
    }
    if (!treatmentObj.doctor) {
      return setModal({ show: true, message: 'Doctor cannot be empty.' });
    }
    if (!treatmentObj.procedure_done) {
      return setModal({ show: true, message: 'Procedure done cannot be empty.' });
    }
    if (!treatmentObj.treatment_date) {
      return setModal({ show: true, message: 'Treatment date cannot be empty.' });
    }

    let { error } = await api.updateTreatment(tid, treatmentObj);
    if (error?.message) {
      return setModal({ show: true, message: error.message });
    }
    return setModal({ show: true, message: `Treatment ${tid} updated.` });
  };

  return (
    <Fragment>
      <Head>
        <title>Edit existing treatment</title>
      </Head>
      <NavBar />
      <div className="container">
        <div className="hold-together">
          <div className="left-column">
            <div>
              <label htmlFor="t_id">
                <strong>Treatment ID</strong>
              </label>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="text"
                name="t_id"
                value={tid}
                className="input-bar small-input-bar"
                onInput={(e) => setTid(e.target.value?.toUpperCase() || '')}
              />
            </div>
            <div style={{ padding: '2vmin 0 2vmin 0' }}>
              <label htmlFor="p_id">
                <strong>Patient ID</strong>
              </label>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="text"
                name="p_id"
                value={formData.p_id}
                className="input-bar small-input-bar"
                onInput={handleInput}
              />
            </div>
            <div>
              <label htmlFor="procedure_done">
                <strong>Procedure Done</strong>
              </label>
              <br />
              <input
                type="text"
                className="input-bar"
                name="procedure_done"
                value={formData.procedure_done}
                onInput={handleInput}
              />
            </div>
            <div style={{ padding: '2vmin 0 2vmin 0' }}>
              <label>
                <strong>Treatment Date</strong>
              </label>
              &nbsp;&nbsp;&nbsp;
              <input
                type="date"
                className="input-bar"
                style={{ width: '9.5vw' }}
                name="treatment_date"
                value={dayjs(formData.treatment_date).format('YYYY-MM-DD')}
                onInput={handleInput}
              />
            </div>
            <div>
              <label>
                <strong>Attended by</strong>
              </label>
              &nbsp;&nbsp;&nbsp;
              <select
                className="input-select"
                name="doctor"
                value={formData.doctor}
                onInput={handleInput}
              >
                {config.DOCTORS.map((doc) => (
                  <option value={doc} key={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="right-column">
            <div>
              <label htmlFor="teeth_number">Teeth Number</label>
              {arrangementFromTeethNumbering(
                config.TEETH_NUMBERING,
                handleToothSelection,
                formData.teeth_number
              )}
            </div>
            <div style={{ padding: '2vmin 0 2vmin 0' }}>
              <label htmlFor="remarks">Remarks</label>&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="text"
                className="input-bar"
                name="remarks"
                value={formData.remarks}
                onInput={handleInput}
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <button className="primary" onClick={handleSubmit}>
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal show={modal.show} handleClick={() => setModal({ show: false, message: null })}>
        <h3>{modal.message}</h3>
      </Modal>
    </Fragment>
  );
}
