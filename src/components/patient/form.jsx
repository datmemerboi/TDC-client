import React from 'react';
import Modal from '../modal';
import config from '../../config.json';

export default class PatientForm extends React.Component {
  constructor(props) {
    super(props);
    this.patient = {
      name: React.createRef(),
      age: React.createRef(),
      gender: React.createRef(),
      contact: React.createRef(),
      address: React.createRef(),
      area: React.createRef(),
      med_history: React.createRef(),
      current_meds: React.createRef()
    };
    this.state = {
      modal: {
        show: false,
        message: null
      }
    };
  };
  toggleModalShow = () => {
    this.setState({ modal: { show: !(this.state.modal.show), message: this.state.modal.message } });
  }
  handleSubmit = () => {
    if (!this.patient.name.current.value || !this.patient.contact.current.value) {
      this.setState({ modal: { show: true, message: "Name & Contact cannot be empty!" } });
    } else {
      console.log(this.patient.med_history.current.value, this.patient.current_meds.current.value);
      const patientObj = {
        name: this.patient.name.current.value.trim(),
        age: parseInt(this.patient.age.current.value) ?? null,
        gender: this.patient.gender.current.value.trim(),
        contact: parseInt(this.patient.contact.current.value),
        address: this.patient.address.current.value.trim(),
        area: this.patient.area.current.value.trim(),
        med_history: this.patient.med_history.current.value.length
          ? this.patient.med_history.current.value.split(',').map(a => a.trim())
          : null,
        current_meds: this.patient.current_meds.current.value.length
          ? this.patient.current_meds.current.value.split(',').map(a => a.trim())
          : null
      };
      var url = process.env?.REACT_APP_ENVIRONMENT === "local"
        ? '/api/patient/new/'
        : config.API_URL + '/api/patient/new/';
      var options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patientObj)
      };
      fetch(url, options)
        .then(res => {
          switch (res.status) {
            case 201:
              return res.json();
              break;
            case 500:
              this.setState({ modal: { show: true, message: "Server Error occured! Try again." } })
              break;
            default:
              this.setState({ modal: { show: true, message: "Some error occured. Try again." } })
          }
        })
        .then(doc => {
          this.setState({
            modal: {
              show: true,
              message: `New user ${this.patient.name.current.value} created! ID:${doc.p_id}`
            }
          });
        })
        .catch(err => console.error(err));
    }
  };
  render() {
    return (
      <React.Fragment>
      <div className="container">
      <div className="hold-together">
        <div className="left-column">
          <div>
            <label><strong>Name</strong></label><br/>
            <input type="text" className="input-bar" ref={this.patient.name} />
          </div>
          <div>
            <label>Age</label><br/>
            <input type="number" min={1} defaultValue={1} className="input-bar small-input-bar" ref={this.patient.age} />
          </div>
          <div>
            <label>Gender</label><br/>
            <select className="input-select" ref={this.patient.gender} defaultValue="O">
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div>
            <label><strong>Contact</strong></label><br/>
            <input type="tel" className="input-bar" ref={this.patient.contact} />
          </div>
          <div>
            <label>Area</label><br/>
            <input type="text" className="input-bar" ref={this.patient.area} />
          </div>
        </div>
        <div className="right-column">
          <div>
            <label>Address</label><br/>
            <textarea className="input-area" ref={this.patient.address} />
          </div>
          <div>
            <label>Medical History</label>&nbsp;
            <label style={{ fontSize: 12 }}>(Comma separated)</label><br/>
            <textarea className="input-area" ref={this.patient.med_history} />
          </div>
          <div>
            <label>Current Medicines</label>&nbsp;
            <label style={{ fontSize: 12 }}>(Comma separated)</label><br/>
            <textarea className="input-area" ref={this.patient.current_meds} />
          </div>
          <br/>
        </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <button className="primary" onClick={this.handleSubmit}>SUBMIT</button>
        </div>
      </div>
      <Modal
        show={this.state.modal.show}
        message={this.state.modal.message}
        content={null}
        onClickHandler={this.toggleModalShow}
      />
      </React.Fragment>
    );
  };
}
