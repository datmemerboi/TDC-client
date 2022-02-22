import dayjs from 'dayjs';
import { Component, useState } from 'react';

import config from '../config.json';
import api from '../utils/api';

const HOUR_STRING_FORMAT = 'hh:mm A';

export function ViewOrEditAppointment(props) {
  /**
   * Component to view as well as edit an appointment within the daily calendar
   *
   * @version 1.2.2
   * @prop {Object} hourObj A dayjs object for the particular hour
   * @prop {Object} appObj The appointment data object
   * @prop {String} mode The display mode determining the render method
   */
  const [state, setState] = useState({
    mode: props.mode || config.APPOINTMENT_MODES.VIEW,
    chosenApp: null
  });

  const switchMode = (event, value) => {
    event.stopPropagation();
    let newMode =
      state.mode === config.APPOINTMENT_MODES.VIEW
        ? config.APPOINTMENT_MODES.EDIT
        : config.APPOINTMENT_MODES.VIEW;
    setState({ mode: newMode, chosenApp: value || null });
  };

  let everyFifteenMins = [];

  for (let i = 0; i < 4; i++) {
    let t = dayjs(props.hourObj)
      .startOf('hour')
      .add(15 * i, 'minutes');

    everyFifteenMins.push({
      words: t.format(HOUR_STRING_FORMAT),
      value: t.valueOf()
    });
  }

  const [formData, setFormData] = useState({
    app_id: props.appObj.app_id,
    p_id: props.appObj.p_id,
    doctor: props.appObj.doctor,
    appointment_date: everyFifteenMins.find(
      ({ value }) => value === new Date(props.appObj.appointment_date).valueOf()
    )['value'],
    status: props.appObj.status
  });

  const handleInput = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let { p_id, doctor, appointment_date, status } = formData;
    let appObj = { p_id, doctor, appointment_date, status };

    let { data } = await api.updateAppointment(formData.app_id, appObj);
    if (Object.keys(data).length) {
      window.location.reload();
    }
  };

  if (state.mode === config.APPOINTMENT_MODES.EDIT) {
    // Edit Appointment
    return (
      <div className="new-appointment-container" onClick={(e) => e.stopPropagation()}>
        <div>
          <select
            className="input-select"
            style={{ width: '8vw' }}
            name="appointment_date"
            value={formData.appointment_date}
            onInput={handleInput}
          >
            {everyFifteenMins.map((opt, i) => (
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
            value={formData.p_id}
            onInput={handleInput}
          />
        </div>
        <div>
          <select
            className="input-select"
            name="doctor"
            value={formData.doctor}
            onInput={handleInput}
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
            value={formData.status}
            onInput={handleInput}
          >
            {config.STATUSES.map((s, i) => (
              <option key={i} value={i}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={handleSubmit} className="accept smaller">
            SUBMIT
          </button>
          <br />
          <button onClick={switchMode} className="reject smaller">
            CANCEL
          </button>
        </div>
      </div>
    );
  } else {
    // View Appointment
    let { appObj } = props;
    const statusAsWords = config.STATUSES[parseInt(appObj.status)];
    return (
      <div
        className={'appointment-strip ' + statusAsWords.toLowerCase()}
        onClick={(e) => switchMode(e, appObj)}
      >
        <div>{dayjs(appObj.appointment_date).format(HOUR_STRING_FORMAT)}</div>
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
          Status: <strong>{statusAsWords}</strong>
        </div>
      </div>
    );
  }
}

export class NewAppointment extends Component {
  /**
   * Component to render new appointment form
   *
   * @version 1.2.2
   * @prop {Object} hourObj A dayjs object for the particular hour
   * @prop {Function} handleClick Function to handle clicking on cancel form
   */
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
          <button onClick={this.props.handleClick} className="reject smaller">
            CANCEL
          </button>
        </div>
      </div>
    );
  }
}
