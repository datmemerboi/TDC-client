import React, { useEffect } from 'react';
import Modal from '../modal';
import { arrangementFromTeethNumbering } from '../common';
import config from '../../config.json';

export default class TreatmentForm extends React.Component {
  constructor(props) {
    super(props);
    this.nullState = {
      pid: null,
      procedure: "",
      teethNum: [],
      remark: "",
      treatmentDate: "",
      doctor: config.DOCTORS[0],
      patient: {
        procedures: [],
        last_visit: null,
        doctors: []
      },
      modalMessage: "",
      togglers: {
        teethArrangement: false,
        remarks: false,
        modal: false,
      }
    };
    this.state = this.nullState;
    this.teethNumHandler = this.teethNumHandler.bind(this);
    this.teethArrangement = arrangementFromTeethNumbering(config.TEETH_NUMBERING, this.teethNumHandler);
  };
  getPatient = () => {
    var url = process.env?.REACT_APP_ENVIRONMENT === "local"
      ? `/api/patient/get/${this.state.pid}`
      : config.API_URL + `/api/patient/get/${this.state.pid}`;
    fetch(url)
      .then(res => {
        if (res.status === 200){ return res.json(); } else { throw res.status; }
      })
      .then(doc => {
        this.setState(state => {
          return ({
            patient: {
              ...state.patient,
              ...doc
            }
          });
        }, this.getPatientHistory);
      })
      .catch(err => console.error(err));
  };
  getPatientHistory = () => {
    var url = process.env.REACT_APP_ENVIRONMENT === "local"
      ? `/api/treatment/history/${this.state.pid}?quick=true`
      : config.API_URL + `/api/treatment/history/${this.state.pid}?quick=true`;
    fetch(url)
      .then(res => {
        if (res.status === 200){ return res.json(); } else { throw res.status; }
      })
      .then(res => {
        this.setState(state => {
          return ({
            patient: {
              ...state.patient,
              ...res
            }
          });
        });
      })
      .catch(err => {
        console.error(err);
        this.setState(state => {
          return ({
            patient: {
              ...state.patient,
              last_visit: null,
              procedures: [],
              doctors: []
            }
          });
        });
      });
  };
  pidHandler = (event) => {
    if (event.target.value.length > 5) {
      this.setState({
        pid: event.target.value.trim()
      }, this.getPatient);
    }
  };
  procedureHandler = (event) => {
    this.setState({ procedure: event.target.value });
  };
  teethNumHandler = (value) => {
    let t = this.state.teethNum;
    if (t.includes(parseInt(value))) {
      t.splice(t.indexOf(parseInt(value)), 1);
      this.setState({ teethNum: t });
    } else {
      t.push(parseInt(value));
      this.setState({ teethNum: t });
    }
  };
  remarkHandler = (event) => {
    this.setState({ remark: event.target.value });
  };
  treatmentDateHandler = (event) => {
    this.setState({ treatmentDate: new Date(event.target.value) });
  };
  doctorHandler = (event) => {
    this.setState({ doctor: event.target.value });
  };
  showTeethArrangement = (event) => {
    this.setState(state => {
      return ({
        togglers: {
          ...state.togglers,
          teethArrangement: !(state.togglers.teethArrangement)
        }
      });
    });
  };
  showRemarks = (event) => {
    this.setState(state => {
      return ({
        togglers: {
          ...state.togglers,
          remarks: !(state.togglers.remarks)
        }
      });
    });
  };
  toggleModal = (msg) => {
    this.setState(state => {
      return({
        togglers: {
          ...state.togglers,
          modal: !(state.togglers.modal)
        },
        modalMessage: msg
      })
    });
  }
  handleSubmit = () => {
    console.log(this.state.pid, this.state.procedure, this.state.treatmentDate, this.state.doctor)
    if (!this.state.pid || !this.state.procedure || !this.state.procedure.length || !this.state.treatmentDate || !this.state.doctor) {
      this.toggleModal("Patient ID, Procedure, Date and Doctor fields cannot be empty");
    } else {
      let treatmentObj = {
        p_id: this.state.pid,
        procedure_done: this.state.procedure,
        teeth_number: this.state.teethNum.length ? this.state.teethNum.sort((a,b) => a > b ? 1 : -1) : null,
        treatment_date: new Date(this.state.treatmentDate),
        doctor: this.state.doctor,
        remarks: this.state.remark
      }
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(treatmentObj)
      };
      // this.toggleModal(JSON.stringify(treatmentObj, null, 4));
      var url = process.env?.REACT_APP_ENVIRONMENT === "local"
        ? '/api/treatment/new/'
        : config.API_URL + '/api/treatment/new/';
      fetch(url, options)
        .then(res => {
          if (res.status === 201) { return res.json() } else { throw res.status }
        })
        .then(doc => {
          this.toggleModal(`New treatment ID: ${doc.t_id}`);
        })
        .catch(err => {
          console.error(err);
          this.toggleModal("Some error occurred! Pls try again.");
        });
    }
  }
  render() {
    return (
      <React.Fragment>
      <div className="container">
        <div className="hold-together">
          <div className="left-column">
            <div style={{ paddingTop: "2vmin", paddingBottom: "2vmin"}}>
              <label><strong>Patient ID</strong></label>&nbsp;&nbsp;&nbsp;
              <input
                type="text"
                className="input-bar small-input-bar"
                onInput={this.pidHandler}
              />
            </div>
            <div>
              <label><strong>Procedure Done</strong></label><br/>
              <input
                type="text"
                className="input-bar"
                onInput={this.procedureHandler}
                defaultValue={this.state.procedure}
              />
            </div>
            <div style={{ paddingTop: "2vmin", paddingBottom: "2vmin"}}>
              <label onClick={this.showTeethArrangement}>Teeth Number &darr;</label><br/>
                {
                  this.state.togglers.teethArrangement
                  ?
                    this.teethArrangement
                  :
                    null
                }
            </div>
            <div>
              <label onClick={this.showRemarks}>Remarks &darr;</label><br/>
              {
                this.state.togglers.remarks
                ?
                  <input
                    className="input-bar"
                    onInput={this.remarkHandler}
                    defaultValue={this.state.remark}
                  />
                :
                  null
              }
            </div>
            <div style={{ paddingTop: "2vmin", paddingBottom: "2vmin"}}>
              <label><strong>Treatment Date</strong></label>&nbsp;&nbsp;&nbsp;
              <input
                type="date"
                className="input-bar"
                style={{ width: "9.5vw" }}
                onInput={this.treatmentDateHandler}
              />
            </div>
            <div>
              <label><strong>Attended by</strong></label>&nbsp;&nbsp;&nbsp;
              <select
                className="input-select"
                onInput={this.doctorHandler}
                defaultValue={this.state.doctor}
              >
                {
                  config.DOCTORS.map(doc => <option value={doc} key={doc}>{doc}</option>)
                }
              </select>
            </div>
            <br/>
            <div>
              <button
                className="primary"
                onClick={this.handleSubmit}
              >
                SUBMIT
              </button>
            </div>
          </div>
          <div className="right-column">
            {
              this.state.patient.p_id
              ?
                <div className="vertical-card short">
                  <h2>{this.state.patient.name}</h2>
                  <h3>{this.state.patient.p_id}</h3>
                  <p>{this.state.patient?.age} / {this.state.patient?.gender}</p>
                  <ul>
                  {
                    this.state.patient?.procedures?.map((proc, i) => <li>{proc.procedure_done}</li>)
                  }
                  </ul>
                  {
                    this.state.patient.doctors && this.state.patient.doctors.length
                    ?
                      <p>Doctors: {this.state.patient?.doctors?.join(', ')}</p>
                    :
                      <p>No treatment history</p>
                  }
                  {
                    this.state.patient.last_visit
                    ?
                      <p>Last visit: {new Date(this.state.patient?.last_visit).toLocaleDateString('en-gb', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    :
                      null
                  }
                </div>
              :
                null
            }
          </div>
        </div>
      </div>
      {
        this.state.togglers.modal
        ?
          <Modal
            show={this.state.togglers.modal}
            message={this.state.modalMessage}
            onClickHandler={this.toggleModal}
          />
        :
          null
      }
      </React.Fragment>
    );
  }
}
