import React, { useEffect } from 'react';
import Hour from './hour';
import { hourObjArrayFromDayObj, filterAppointmentsForDay } from '../common.js';

export default function Day({ dayObj, appointments }) {
  var hourObjArray = hourObjArrayFromDayObj(dayObj);
  const apps = filterAppointmentsForDay(appointments, dayObj.start_of_day, dayObj.end_of_day);
  /*
  {
    "date": 28,
    "day": 0,
    "month": 1,
    "year": 2021,
    "start_of_day": 1614450600,
    "end_of_day": 1614536999,
    "date_string": "2021-2-28",
    "is_today": false
  }
  */
  var hours = hourObjArray.map(h => <Hour hourObj={h} key={h.words} appointments={apps}/>);
  return (
    <div className="day-scrollable-container">
      <div className="day-details">
        <strong>
          {
            new Date(dayObj.year, dayObj.month, dayObj.date).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })
          }
        </strong>
      </div>
      <div className="day-hours">
        {hours}
      </div>
    </div>
  )
}
