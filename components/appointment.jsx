import dayjs from 'dayjs';
import { Component } from 'react';

import config from '../config.json';
import api from '../utils/api';

const HOUR_STRING_FORMAT = 'hh:mm A';

export class EditMode extends Component {
  constructor(props) {
    super(props);
    this.everyFifteenMins = [];

    for (let i = 0; i < 4; i++) {
      let t = dayjs(props.hourObj)
        .startOf('hour')
        .add(15 * i, 'minutes');

      this.everyFifteenMins.push({
        words: t.format(HOUR_STRING_FORMAT),
        value: t.valueOf()
      });
    }

    this.appid = props.app.app_id;

    this.state = {
      app_id: props.app.app_id,
      p_id: props.app.p_id,
      doctor: props.app.doctor,
      appointment_date: this.everyFifteenMins.find(
        ({ value }) => value === new Date(props.app.appointment_date).valueOf()
      )['value'],
      status: props.app.status
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    let { p_id, doctor, appointment_date, status } = this.state;
    let appObj = { p_id, doctor, appointment_date, status };

    let { data } = await api.updateAppointment(this.state.app_id, appObj);
    if (Object.keys(data).length) {
      window.location.reload();
    }
  };

  render() {
    return (
      <div className="new-appointment-container" onClick={(e) => e.stopPropagation()}>
        <div>
          <select
            className="input-select"
            style={{ width: '8vw' }}
            name="appointment_date"
            value={this.state.time}
            onInput={this.handleInput}
          >
            {this.everyFifteenMins.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.words}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Patient ID</label>&nbsp;&nbsp;
          <input
            type="text"
            className="input-bar small-input-bar"
            name="p_id"
            value={this.state.p_id}
            onInput={this.handleInput}
          />
        </div>
        <div>
          <select
            className="input-select"
            name="doctor"
            value={this.state.doctor}
            onInput={this.handleInput}
          >
            {config.DOCTORS.map((doc, i) => (
              <option key={i} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="input-select"
            style={{ width: '8vw', padding: '0 1vmin 0 1vmin' }}
            name="status"
            value={this.state.status}
            onInput={this.statusInputHandler}
          >
            {config.STATUSES.map((s, i) => (
              <option key={i} value={i}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={this.handleSubmit} className="accept smaller">
            SUBMIT
          </button>
          <br />
          <button onClick={this.props.returnToParent} className="reject smaller">
            CANCEL
          </button>
        </div>
      </div>
    );
  }
}

export function ViewAppointment({ appObj, clickHandler }) {
  const currentStatus = config.STATUSES[parseInt(appObj.status)];
  return (
    <div className={'appointment-strip ' + currentStatus.toLowerCase()} onClick={clickHandler}>
      <div>{dayjs(appObj.appointment_date).format(HOUR_STRING_FORMAT)}</div>
      <div className="hold-together">
        <div>
          {appObj.patient && appObj.patient.name ? (
            <strong>{appObj.patient.name}</strong>
          ) : (
            <em>Unknown Patient</em>
          )}
        </div>
        <div>Doctor: {appObj.doctor}</div>
        <div>
          Appointment ID: <strong>{appObj.app_id}</strong>
          <br />
          Status: <strong>{currentStatus}</strong>
        </div>
      </div>
    </div>
  );
}

export class NewAppointment extends Component {
  constructor(props) {
    super(props);
    this.everyFifteenMins = [];

    for (let i = 0; i < 4; i++) {
      let t = dayjs(props.hourObj)
        .startOf('hour')
        .add(15 * i, 'minutes');

      this.everyFifteenMins.push({
        words: t.format(HOUR_STRING_FORMAT),
        value: t.valueOf()
      });
    }

    this.state = {
      p_id: '',
      doctor: config.DOCTORS[0],
      appointment_date: this.everyFifteenMins[0]['value'],
      status: 1
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    let { p_id, doctor, appointment_date, status } = this.state;
    let appObj = { p_id, doctor, appointment_date, status };

    console.log(appObj);

    const { data } = await api.createAppointment(appObj);
    if (Object.keys(data).length) {
      window.location.reload();
    }
  };

  render() {
    return (
      <div className="new-appointment-container" onClick={(e) => e.stopPropagation()}>
        <div>
          <select
            className="input-select"
            style={{ width: '8vw' }}
            name="appointment_date"
            onInput={this.handleInput}
          >
            {this.everyFifteenMins.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.words}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Patient ID</label>&nbsp;&nbsp;
          <input
            type="text"
            className="input-bar small-input-bar"
            name="p_id"
            value={this.state.p_id}
            onInput={this.handleInput}
          />
        </div>
        <div>
          <select
            className="input-select"
            name="doctor"
            defaultValue={config.DOCTORS[0]}
            onInput={this.handleInput}
          >
            {config.DOCTORS.map((doc, i) => (
              <option key={i} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="input-select"
            style={{ width: '8vw', padding: '0 1vmin 0 1vmin' }}
            name="status"
            defaultValue={this.state.status}
            onInput={this.handleInput}
          >
            {config.STATUSES.map((s, i) => (
              <option key={i} value={i}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={this.handleSubmit} className="accept smaller">
            SUBMIT
          </button>
          <br />
          <button onClick={this.props.returnToParent} className="reject smaller">
            CANCEL
          </button>
        </div>
      </div>
    );
  }
}
