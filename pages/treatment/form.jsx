import dayjs from 'dayjs';
import Head from 'next/head';
import { Fragment, useState, useEffect } from 'react';

import api from '../../utils/api';
import config from '../../config.json';
import Modal from '../../components/modal';
import NavBar from '../../components/navbar';
import { arrangementFromTeethNumbering } from '../../components/common';

export default function TreatmentForm() {
  /**
   * Page to render new treatment form
   *
   * @version 1.2.2
   * @route /treatment/form
   */
  const defaultState = {
    procedure_done: '',
    teeth_number: [],
    remark: '',
    treatment_date: '',
    doctor: config.DOCTORS[0]
  };
  const defaultPatient = {
    p_id: null,
    name: '',
    procedures: [],
    last_visit: null,
    doctors: []
  };

  const [formData, setFormData] = useState(defaultState);
  const [patient, setPatient] = useState(defaultPatient);
  const [togglers, setTogglers] = useState({ showTeethArrangement: false, showRemarks: false });
  const [modal, setModal] = useState({ show: false, message: '' });

  useEffect(async () => {
    let patientRecord = await api.getPatient(patient.p_id); // Get patient
    let patientHistory = await api.getPatientHistory(patient.p_id); // Get patient history

    if (patientRecord.data && patientHistory.data) {
      let { name, age, gender } = patientRecord.data;
      let { doctors, last_visit, procedures } = patientHistory.data;

      setPatient({
        p_id: patient.p_id,
        name,
        age,
        gender,
        doctors,
        last_visit,
        procedures
      });
    }
  }, [patient.p_id]);

  const handleInput = (e) => {
    let { name, value } = e.target;
    if (name === 'treatment_date') {
      value = new Date(value);
    }
    setFormData({ ...formData, [name]: value });
  };
  const handleToothSelection = (value) => {
    let newTeeth = parseInt(value);

    setFormData((prev) => {
      let previouslySelected = prev.teeth_number;
      let newlySelected = [...previouslySelected];

      if (previouslySelected.includes(newTeeth)) {
        newlySelected.splice(previouslySelected.indexOf(newTeeth));
      } else {
        newlySelected.push(newTeeth);
      }

      return { ...prev, teeth_number: newlySelected.sort((a, b) => (a > b ? 1 : -1)) };
    });
  };
  const handleSubmit = async () => {
    let { data, error } = await api.createTreatment({ ...formData, p_id: patient.p_id });
    if (error?.message) {
      setModal({ show: true, message: error.message });
    } else {
      setModal({ show: true, message: `Treatment ${data.t_id} created` });
    }
  };

  const teethArrangement = arrangementFromTeethNumbering(
    config.TEETH_NUMBERING,
    handleToothSelection
  );

  return (
    <Fragment>
      <Head>
        <title>Create new treatment</title>
      </Head>
      <NavBar />
      <div className="container">
        <div className="hold-together">
          <div className="left-column">
            <div style={{ paddingTop: '2vmin', paddingBottom: '2vmin' }}>
              <label>
                <strong>Patient ID</strong>
              </label>
              &nbsp;&nbsp;&nbsp;
              <input
                type="text"
                className="input-bar small-input-bar"
                onInput={(e) => {
                  setPatient({ ...patient, p_id: e.target.value.toUpperCase() ?? e.target.value });
                }}
              />
            </div>
            <div>
              <label>
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
            <div style={{ paddingTop: '2vmin', paddingBottom: '2vmin' }}>
              <label
                onClick={() => {
                  setTogglers((prev) => ({
                    ...prev,
                    showTeethArrangement: !prev.showTeethArrangement
                  }));
                }}
              >
                Teeth Number &darr;
              </label>
              <br />
              {/* TODO: Below loc */}
              {togglers.showTeethArrangement ? teethArrangement : null}
            </div>
            <div>
              <label
                onClick={() => {
                  setTogglers((prev) => ({ ...prev, showRemarks: !prev.showRemarks }));
                }}
              >
                Remarks &darr;
              </label>
              <br />
              {togglers.showRemarks ? (
                <input
                  className="input-bar"
                  name="remark"
                  value={formData.remark}
                  onInput={handleInput}
                />
              ) : null}
            </div>
            <div style={{ paddingTop: '2vmin', paddingBottom: '2vmin' }}>
              <label>
                <strong>Treatment Date</strong>
              </label>
              &nbsp;&nbsp;&nbsp;
              <input
                type="date"
                className="input-bar"
                style={{ width: '9.5vw' }}
                name="treatment_date"
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
            <br />
            <div>
              <button className="primary" onClick={handleSubmit}>
                SUBMIT
              </button>
            </div>
          </div>
          <div className="right-column">
            {patient.p_id ? (
              <div className="vertical-card short">
                <h2>{patient.name}</h2>
                <h3>{patient.p_id}</h3>
                <p>
                  {patient?.age} / {patient?.gender}
                </p>
                <ul>
                  {patient?.procedures?.map((proc) => (
                    <li>{proc.procedure_done}</li>
                  ))}
                </ul>
                {patient.doctors && patient.doctors.length ? (
                  <p>Doctors: {patient.doctors.join(', ')}</p>
                ) : (
                  <p>No treatment history</p>
                )}
                {patient.last_visit ? (
                  <p>
                    Last visit:&nbsp;
                    {patient.last_visit ? dayjs(patient.last_visit).format('DD MMMM YYYY') : null}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Modal show={modal.show} handleClick={() => setModal({ show: false })}>
        <h3>{modal.message}</h3>
      </Modal>
    </Fragment>
  );
}
