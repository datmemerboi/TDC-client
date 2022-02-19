import Head from 'next/head';
import { Component, Fragment, createRef } from 'react';

import api from '../../utils/api';
import Modal from '../../components/modal';
import NavBar from '../../components/navbar';

export default class PatientForm extends Component {
  /**
   * Page to render new-patient form
   *
   * @version 1.2.2
   * @route /patient/form
   */
  constructor(props) {
    super(props);

    this.patient = {
      name: createRef(),
      age: createRef(),
      gender: createRef(),
      contact: createRef(),
      address: createRef(),
      area: createRef(),
      med_history: createRef(),
      current_meds: createRef()
    };

    this.state = {
      showModal: false,
      message: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal = () => {
    this.setState({ showModal: false, message: null });
  };

  handleSubmit = async () => {
    if (this.patient.name.current.value === '') {
      console.info('calling modal');
      this.setState({ showModal: true, message: 'Name cannot be empty!' });
      return;
    }
    if (this.patient.contact.current.value === '') {
      this.setState({ showModal: true, message: 'Contact cannot be empty!' });
      return;
    }

    let patientObj = Object.entries(this.patient).reduce((acc, [key, ref]) => {
      if (ref.current.value && ref.current.value.length) {
        if (key === 'age' || key === 'contact') {
          return { ...acc, [key]: parseInt(ref.current.value) };
        }
        if (key === 'med_history' || key === 'current_meds') {
          return { ...acc, [key]: ref.current.value.split(',') };
        }
        return { ...acc, [key]: ref.current.value.trim() };
      }
      return acc;
    }, {});

    let { data, error } = await api.createPatient(patientObj);
    if (error) {
      this.setState({ showModal: true, message: error?.message });
    } else {
      this.setState({
        showModal: true,
        message: `New patient ${this.patient.name.current.value} created! ID:${data.p_id}`
      });
    }
  };

  render() {
    return (
      <Fragment>
        <Head>
          <title>Create new patient</title>
        </Head>
        <NavBar />
        <div className="container">
          <div className="hold-together">
            <div className="left-column">
              <div>
                <label>
                  <strong>Name</strong>
                </label>
                <br />
                <input type="text" className="input-bar" ref={this.patient.name} />
              </div>
              <div>
                <label>Age</label>
                <br />
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="input-bar small-input-bar"
                  ref={this.patient.age}
                />
              </div>
              <div>
                <label>Gender</label>
                <br />
                <select className="input-select" ref={this.patient.gender} defaultValue="O">
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
                <input type="tel" className="input-bar" ref={this.patient.contact} />
              </div>
              <div>
                <label>Area</label>
                <br />
                <input type="text" className="input-bar" ref={this.patient.area} />
              </div>
            </div>
            <div className="right-column">
              <div>
                <label>Address</label>
                <br />
                <textarea className="input-area" ref={this.patient.address} />
              </div>
              <div>
                <label>Medical History</label>&nbsp;
                <label style={{ fontSize: 12 }}>(Comma separated)</label>
                <br />
                <textarea className="input-area" ref={this.patient.med_history} />
              </div>
              <div>
                <label>Current Medicines</label>&nbsp;
                <label style={{ fontSize: 12 }}>(Comma separated)</label>
                <br />
                <textarea className="input-area" ref={this.patient.current_meds} />
              </div>
              <br />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button type="submit" className="primary" onClick={this.handleSubmit}>
              SUBMIT
            </button>
          </div>
        </div>
        <Modal show={this.state.showModal} handleClick={this.closeModal}>
          <h3>{this.state.message}</h3>
        </Modal>
      </Fragment>
    );
  }
}
