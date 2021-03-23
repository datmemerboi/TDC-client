import React from 'react';
import { everyFifteenMinsOfHour } from '../common';
const config = require('../../config.json')[process.env.NODE_ENV ?? "dev"];

function ViewMode({ app, returnToParent }) {
  const currentStatus = config.STATUSES[parseInt(app.status)];
  return (
    <div
      className={"appointment-strip " + currentStatus.toLowerCase()}
      onClick={returnToParent}
    >
      <div>
        {new Date(app.appointment_date).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true})}
      </div>
      <div className="hold-together">
        <div>
          {app.patient.name}
        </div>
        <div>
          Doctor: {app.doctor}
        </div>
        <div>
          Appointment ID: <b>{app.app_id}</b><br/>
          Status: <b>{currentStatus}</b>
        </div>
      </div>
    </div>
  );
}

class EditMode extends React.Component {
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
    this.appid = props.app.app_id;
    this.state = {
      pid: props.app.p_id,
      doctor: props.app.doctor,
      time: this.everyFifteenMins.filter(m => m.value === new Date(props.app.appointment_date).getTime())[0]["value"],
      status: props.app.status
    };

    this.pidInputHandler = this.pidInputHandler.bind(this);
    this.doctorInputHandler = this.doctorInputHandler.bind(this);
    this.timeInputHandler = this.timeInputHandler.bind(this);
    this.statusInputHandler = this.statusInputHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  pidInputHandler = (event) => {
    this.setState({ pid: event.target.value.trim() });
  }
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
    }
    let options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointmentObj)
    };
    var url = process.env.REACT_APP_ENVIRONMENT === "local"
      ? `/api/appointment/update/${this.appid}`
      : config.API_URL + `/api/appointment/update/${this.appid}`;
    console.log(appointmentObj, url);
    fetch(url, options)
      .then(res => {
        if (res.status === 200) {
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
          <label>Patient ID</label>&nbsp;&nbsp;
          <input
            type="text"
            value={this.state.pid}
            className="input-bar small-input-bar"
            onInput={this.pidInputHandler}
          />
        </div>
        <div>
          <select
            className="input-select"
            onInput={this.doctorInputHandler}
            defaultValue={this.state.doctor}
          >
            {
              this.doctors.map((doc,i) => <option key={i} value={doc}>{doc}</option>)
            }
          </select>
        </div>
        <div>
          <select
            className="input-select"
            style={{ width: "7vw" }}
            onInput={this.timeInputHandler}
            defaultValue={this.state.time}
          >
            {
              this.everyFifteenMins.map((opt, i) => <option key={i} value={opt.value}>{opt.words}</option> )
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
        <div style={{ verticalAlign: "middle" }}>
          <button
            onClick={this.handleSubmit}
            className="accept smaller"
          >
            SUBMIT
          </button>
          <br/>
          <button
            onClick={this.props.returnToParent}
            className="reject smaller"
          >
            CANCEL
          </button>
        </div>
      </div>
    );
  }
};

export default function Appointment({ app, hourObj }) {
  const [mode, setMode] = React.useState(1);
  const clickHandler = (event) => {
    event.stopPropagation();
    console.log("Clicking Appointment");
  }
  const toggleMode = (event) => {
    event.stopPropagation();
    setMode(!mode);
  }
  if (mode) {
    // View Appointment mode
    return <ViewMode app={app} returnToParent={toggleMode} />
  } else {
    // Edit Appointment mode
    return <EditMode hourObj={hourObj} app={app} returnToParent={toggleMode} />
  }
}
