import { useState } from 'react';

import { NewAppointment, ViewOrEditAppointment } from './appointment';

const HOUR_STRING_FORMAT = 'hh:mm A';

export default function Hour({ hourObj, appointments }) {
/**
   * Hour component within a daily calendar
   *
   * @version 1.2.2
   * @prop {Object} hourObj A dayjs object for the particular hour
   * @prop {Array} appointments List of appointments for this month
   */
  const [showNewAppForm, setShowNewAppForm] = useState(false);
  const beyondWorkingHours = hourObj.hour() <= 7 || hourObj.hour() >= 21;

  if (beyondWorkingHours) {
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
            <NewAppointment hourObj={hourObj} handleClick={handleClick} />
          ) : null}
          {appsInThisHour.length
            ? appsInThisHour.map((app) => (
                <ViewOrEditAppointment hourObj={hourObj} appObj={app} key={app.app_id} />
              ))
            : null}
        </div>
      </div>
    );
  }
}
