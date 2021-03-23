import React from 'react';
const config = require('../../config')[process.env.NODE_ENV ?? "dev"];

export default class NewAppointment extends React.Component {
  constructor(props) {
    super(props);
    this.hourObj = props.hourObj;
    this.doctors = config.DOCTORS;
    this.statuses = config.STATUSES;
    this.everyFifteenMins = Array.from({ length: 4 }, (_,i) => {
      let d = new Date((this.hourObj.start_of_hour*1000)+(i*900000));
      return {
        words: d.toLocaleString("default", { hour: "numeric", minute: "numeric" }),
        value: d.getTime()
      };
    });
    this.state = {
      pid: "",
      doctor: config.DOCTORS[0],
      time: this.everyFifteenMins[0]["value"],
      status: 1
    };
    this.pidInputHandler = this.pidInputHandler.bind(this);
    this.doctorInputHandler = this.doctorInputHandler.bind(this);
    this.statusInputHandler = this.statusInputHandler.bind(this);
    this.timeInputHandler = this.timeInputHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  pidInputHandler = (event) => {
    // event.stopPropagation();
    this.setState({ pid: event.target.value.trim() });
  };
  doctorInputHandler = (event) => {
    this.setState({ doctor: event.target.value });
  }
  statusInputHandler = (event) => {
    this.setState({ status: parseInt(event.target.value) });
  }
  timeInputHandler = (event) => {
    this.setState({ time: parseInt(event.target.value) });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    let appointmentObj = {
      p_id: this.state.pid,
      doctor: this.state.doctor,
      appointment_date: this.state.time,
      status: this.state.status
    };
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointmentObj)
    };
    var url = process.env.REACT_APP_ENVIRONMENT === "local"
      ? `/api/appointment/new/`
      : config.API_URL + `/api/appointment/new/`;
    fetch(url, options)
      .then(res => {
        if (res.status === 201) {
          window.location.reload();
        } else {
          throw res.status;
        }
      })
      .catch(err => console.error(err));
  }
  render() {
    return (
      <div
        className="new-appointment-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <select
            className="input-select"
            style={{ width: "7vw" }}
            onInput={this.timeInputHandler}
          >
            {
              this.everyFifteenMins.map((opt, i) => <option key={i} value={opt.value}>{opt.words}</option> )
            }
          </select>
        </div>
        <div>
          <label>Patient ID</label>&nbsp;&nbsp;
          <input
            type="text"
            className="input-bar small-input-bar"
            onInput={this.pidInputHandler}
          />
        </div>
        <div>
          <select
            className="input-select"
            onInput={this.doctorInputHandler}
            defaultValue={this.doctors[0]}
          >
            {
              this.doctors.map((doc,i) => <option key={i} value={doc}>{doc}</option>)
            }
          </select>
        </div>
        <div>
          <select
            className="input-select"
            style={{ width: "8vw", padding: "0 1vmin 0 1vmin" }}
            onInput={this.statusInputHandler}
            defaultValue={this.state.status}
          >
            {
              this.statuses.map((s,i) => <option key={i} value={i}>{s}</option>)
            }
          </select>
        </div>
        <div>
          <button onClick={this.handleSubmit} className="accept smaller">SUBMIT</button><br/>
          <button onClick={this.props.returnToParent} className="reject smaller">CANCEL</button>
        </div>
      </div>
    );
  }
}
