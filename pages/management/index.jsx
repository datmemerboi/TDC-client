import Head from 'next/head';
import { Fragment, useRef, useState } from 'react';

import api from '../../utils/api';
import config from '../../config.json';
import Modal from '../../components/modal';
import NavBar from '../../components/navbar';

export default function () {
  const [modal, setModal] = useState({ show: false, type: null, message: null });
  const patientRef = useRef();
  const treatmentRef = useRef();
  const doctorRef = useRef();

  const setPatient = () => {
    let { value } = patientRef.current;
    if (value.length) {
      setModal({ show: true, type: config.DELETE_TYPES.PATIENT, value });
    }
  };
  const setTreatment = () => {
    let { value } = treatmentRef.current;
    if (value.length) {
      setModal({ show: true, type: config.DELETE_TYPES.TREATMENT, value });
    }
  };

  const addDoctor = async () => {
    let { value } = doctorRef.current;
    if (value.length && !config.DOCTORS.includes(value)) {
      let newDocList = [...config.DOCTORS, value];
      let { error } = api.changeDoctors(newDocList);
      if (!error?.status && !error?.message) {
        window.location.reload();
      }
    }
  };

  const deleteRecord = async (type) => {
    if (type === config.DELETE_TYPES.PATIENT) {
      // Delete Patient
      let { data, error } = await api.deletePatient(patientRef.current.value);
      console.log(data, error);
      if (error?.message) {
        // ERROR
        return setModal({ ...modal, show: true, message: error.message });
      }
      // SUCCESS
      return setModal({
        ...modal,
        show: true,
        message: `Patient ${patientRef.current.value} deleted!`
      });
    } else if (type === config.DELETE_TYPES.TREATMENT) {
      // Delete Treatment
      let { error } = await api.deleteTreatment(treatmentRef.current.value);
      if (error?.message) {
        // ERROR
        return setModal({ ...modal, show: true, message: error.message });
      }
      // SUCCESS
      return setModal({
        ...modal,
        show: true,
        message: `Treatment ${patientRef.current.value} deleted!`
      });
    }
  };
  return (
    <Fragment>
      <Head>
        <title>Management</title>
      </Head>
      <NavBar />
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            height: '50vh'
          }}
        >
          <div>
            <strong>Current doctors</strong>: {config.DOCTORS.join(', ')}
          </div>
          <div>
            <strong>Add doctor</strong>&nbsp;
            <input type="text" name="doctor" className="input-bar" ref={doctorRef} />
            &nbsp;&nbsp;
            <button className="primary smaller" onClick={addDoctor}>
              Save
            </button>
          </div>
          <div>
            <strong>Delete Patient</strong>:&nbsp;
            <input type="text" className="input-bar small-input-bar" name="p_id" ref={patientRef} />
            &nbsp;&nbsp;
            <button className="primary smaller" onClick={setPatient}>
              Delete
            </button>
          </div>
          <div>
            <strong>Delete Treatment</strong>:&nbsp;
            <input
              type="text"
              className="input-bar small-input-bar"
              name="t_id"
              ref={treatmentRef}
            />
            &nbsp;&nbsp;
            <button className="primary smaller" onClick={setTreatment}>
              Delete
            </button>
          </div>
        </div>
      </div>
      <Modal show={modal.show} handleClick={() => setModal({ ...modal, show: false })}>
        {modal.message ? (
          <h3>{modal.message}</h3>
        ) : (
          <Fragment>
            {modal.type === config.DELETE_TYPES.PATIENT ? (
              <h3>Do you want to delete {patientRef.current?.value} ?</h3>
            ) : (
              <h3>Do you want to delete {treatmentRef.current?.value} ?</h3>
            )}
            <div>
              <button className="accept smaller" onClick={() => deleteRecord(modal.type)}>
                YES
              </button>
              <button
                className="reject smaller"
                onClick={() => setModal({ show: false, type: null, value: null })}
              >
                NO
              </button>
            </div>
          </Fragment>
        )}
      </Modal>
    </Fragment>
  );
}
