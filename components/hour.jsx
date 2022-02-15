import { useState } from 'react';

import Appointment from './calendar/appointment';
import { NewAppointment, ViewAppointment } from './appointment';

const HOUR_STRING_FORMAT = 'hh:mm A';

export default function Hour({ hourObj, appointments }) {
  const [showNewAppForm, setShowNewAppForm] = useState(false);
  const hourIsDisabled = hourObj.hour() <= 7 || hourObj.hour() >= 21;

  if (hourIsDisabled) {
    return <div className="hour disabled">{hourObj.format(HOUR_STRING_FORMAT)}</div>;
  } else {
    let startOfHour = hourObj.startOf('hour').valueOf();
    let endOfHour = hourObj.endOf('hour').valueOf();

    const appsInThisHour = appointments
      ?.filter((app) => {
        let d = new Date(app.appointment_date);
        return d >= startOfHour && d <= endOfHour;
      })
      .sort((a, b) => (a.appointment_date > b.appointment_date ? 1 : -1));

    const handleClick = () => setShowNewAppForm(!showNewAppForm);

    return (
      <div className="hour" onClick={handleClick}>
        <strong>{hourObj.format(HOUR_STRING_FORMAT)}</strong>
        <div className="appointment-container">
          {showNewAppForm ? (
            <NewAppointment hourObj={hourObj} returnToParent={handleClick} />
          ) : null}
          {appsInThisHour.length
            ? appsInThisHour.map((app) => (
                <ViewAppointment appObj={app} key={app.app_id} clickHandler={() => {}} />
              ))
            : null}
        </div>
      </div>
    );
  }
}
