import React from 'react';
import Modal from '../modal';
const config = require('../../config.json')[process.env.NODE_ENV];

export default class PatientEdit extends React.Component {
  constructor(props) {
    super(props);
    const defaultState = {
      name: "",
      age: 1,
      gender: "",
      contact: 0,
      address: "",
      area: "",
      med_history: "",
      current_meds: "",
      p_id: "",
      modal: {
        show: false,
        message: null
      }
    };
    this.state = defaultState;
  }

  pidInput = (event) => {
    this.setState({ p_id: event.target.value.trim() }, this.pidChange);
  }
  pidChange = () => {
    if (this.state.p_id && this.state.p_id.length > 5) {
      var url = process.env?.REACT_APP_ENVIRONMENT === "local"
        ? `/api/patient/get/${this.state.p_id}/`
        : config.API_URL + `/api/patient/get/${this.state.p_id}/`;
      var options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      };
      fetch(url, options)
        .then(res => {
          switch(res.status) {
            case 200:
              return res.json();
            case 500:
              console.error("Error!");
              this.setState(this.defaultState);
              break;
            default:
              this.setState(this.defaultState);
              break;
          }
        })
        .then(doc => {
          this.setState({
            ...JSON.parse(JSON.stringify(doc)),
            med_history: doc.med_history?.length > 0 ? doc.med_history.join(', ') : this.state.med_history,
            current_meds: doc.current_meds?.length > 0 ? doc.current_meds.join(', ') : this.state.current_meds
          });
        })
        .catch(err => console.error(err))
    }
  }
  nameInput = (event) => {
    this.setState({ name: event.target.value });
  }
  ageInput = (event) => {
    this.setState({ age: parseInt(event.target.value) });
  }
  genderChoice = (event) => {
    this.setState({ gender: event.target.value });
  }
  contactInput = (event) => {
    this.setState({ contact: parseInt(event.target.value) })
  }
  addressInput = (event) => {
    this.setState({ address: event.target.value });
  }
  areaInput = (event) => {
    this.setState({ area: event.target.value });
  }
  medHisInput = (event) => {
    this.setState({ med_history: event.target.value });
  }
  currentMedsInput = (event) => {
    this.setState({ current_meds: event.target.value });
  }
  toggleModalShow = () => {
    this.setState({ modal: { show: !(this.state.modal.show), message: this.state.modal.message } });
  }
  handleSubmit = (event) => {
    var patientObj = {
      name: this.state.name.trim(),
      contact: this.state.contact,
      age: this.state.age || null,
      gender: this.state.gender || "",
      area: this.state.area ?? null,
      med_history: this.state.med_history.length ? this.state.med_history.split(',').map(a => a.trim()) : null,
      current_meds: this.state.current_meds.length ? this.state.current_meds.split(',').map(a => a.trim()) : null
    };
    var url = process.env?.REACT_APP_ENVIRONMENT === "local"
      ? `/api/patient/update/${this.state.p_id}`
      : config.API_URL + `/api/patient/update/${this.state.p_id}`;
    var options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patientObj)
    };
    fetch(url, options)
      .then(res => {
        switch (res.status) {
          case 201:
            return;
          case 500:
            this.setState({ modal: { show: true, message: "Server Error occured! Try again." } })
            break;
          default:
            this.setState({ modal: { show: true, message: "Some error occured. Try again." } });
            break;
        }
      })
      .then(() => {
        console.log(JSON.stringify(patientObj, null, 4));
        this.setState({
          modal: {
            show: true,
            message: `ID:${this.state.p_id} updated!`
          }
        });
      })
      .catch(err => console.error(err));
  }
  render() {
    return (
      <React.Fragment>
        <div className="container">
        <div className="hold-together">
          <div className="left-column">
            <div>
              <label><strong>Patient ID</strong></label><br/>
              <input type="text" className="input-bar small-input-bar" onChange={this.pidInput} value={this.state.p_id} />
            </div>
            <div>
              <label><strong>Name</strong></label><br/>
              <input type="text" className="input-bar" onChange={this.nameInput} value={this.state.name} required />
            </div>
            <div>
              <label>Age</label><br/>
              <input type="number" min={1} className="input-bar small-input-bar" onChange={this.ageInput} value={this.state.age} />
            </div>
            <div>
              <label>Gender</label><br/>
              <select className="input-select" value={this.state.gender} onChange={this.genderChoice}>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div>
              <label><strong>Contact</strong></label><br/>
              <input type="tel" className="input-bar" onChange={this.contactInput} value={this.state.contact}/>
            </div>
            <div>
              <label>Area</label><br/>
              <input type="text" className="input-bar" onChange={this.areaInput} value={this.state.area} />
            </div>
          </div>
          <div className="right-column">
            <div>
              <label>Address</label><br/>
              <textarea className="input-area" onChange={this.addressInput} value={this.state.address ?? ""} />
            </div>
            <div>
              <label>Medical History</label>&nbsp;
              <label style={{ fontSize: 12 }}>(Comma separated)</label><br/>
              <textarea className="input-area" onChange={this.medHisInput} value={this.state.med_history ?? ""} />
            </div>
            <div>
              <label>Current Medicines</label>&nbsp;
              <label style={{ fontSize: 12 }}>(Comma separated)</label><br/>
              <textarea className="input-area" onChange={this.currentMedsInput} value={this.state.current_meds ?? ""} />
            </div>
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
  }
};
