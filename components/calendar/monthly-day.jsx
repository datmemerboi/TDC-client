import React from 'react';

export default function MonthlyDay({ dayObj, appointments, key, returnToParent }) {
  const sendBackDayObj = () => {
    returnToParent(dayObj);
  }
  var todayApps;
  if (appointments && dayObj) {
    todayApps = appointments.filter(doc => {
      let d = new Date(doc.appointment_date);
      return doc.status === 1 && dayObj.start_of_day <= (d.getTime()/1000) && dayObj.end_of_day >= (d.getTime()/1000);
    });
  }
  if (dayObj === null) {
    return (
      <div className="day disabled" key={key} />
    );
  } else {
    if (todayApps && todayApps?.length) {
      if (todayApps.length > 4) {
        return (
          <div className="day" key={key} onClick={sendBackDayObj}>
            <span className={dayObj.is_today ? "is-today" : null}>
              {dayObj.date}
            </span>
            <div className="appointment-strip busy">
              {todayApps.length}
            </div>
          </div>
        );
      } else if (todayApps.length > 2) {
        return (
          <div className="day" key={key} onClick={sendBackDayObj}>
            <span className={dayObj.is_today ? "is-today" : null}>
              {dayObj.date}
            </span>
            <div className="appointment-strip occupied">
              {todayApps.length}
            </div>
          </div>
        );
      } else {
        return (
          <div className="day" key={key} onClick={sendBackDayObj}>
            <span className={dayObj.is_today ? "is-today" : null}>
              {dayObj.date}
            </span>
            <div className="appointment-strip available">
              {todayApps.length}
            </div>
          </div>
        );
      }

    } else {
      return (
        <div className="day" key={key} onClick={sendBackDayObj}>
          <span className={dayObj.is_today ? "is-today" : null}>
            {dayObj.date}
          </span>
        </div>
      );
    }
  }
};
