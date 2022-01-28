import React from 'react';
import Appointment from './appointment';
import NewAppointment from './new-appointment';
import { filterAppointmentsForHour } from '../common.js';
import config from '../../config.json';

export default function Hour({ hourObj, appointments }) {
  const [showNewAppointment, setShowNewAppointment] = React.useState(false);
  if (hourObj.disabled) {
    // Disabled hour
    return (
      <div className="hour disabled">{hourObj.words}</div>
    );
  } else {
    // Working hour
    const apps = filterAppointmentsForHour(appointments, hourObj.start_of_hour, hourObj.end_of_hour);
    const clickHandler = () => {
      setShowNewAppointment(!showNewAppointment);
      console.log("Clicked hour!");
    }
    return (
      <div className="hour" onClick={clickHandler}>
        <strong>{hourObj.words}</strong>
        <div className="appointment-container">
          {
            showNewAppointment
            ?
              <NewAppointment hourObj={hourObj} returnToParent={clickHandler}/>
            :
              null
          }
          {
            appointments.length
            ?
              apps
                .sort((a,b) => a.appointment_date > b.appointment_date ? 1 : -1)
                .map(app => <Appointment app={app} hourObj={hourObj} key={app.app_id} />)
            :
              null
          }
        </div>
      </div>
    );
  }
}
