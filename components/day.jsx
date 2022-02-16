import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';

import Hour from './hour';

dayjs.extend(isToday);
dayjs.extend(isBetween);

const DAY_STRING_FORMAT = 'DD MMM YYYY';

export function WeekDay({ dayObj, handleClick, appointments }) {
  /**
   * Day component within week of a monthly calendar
   *
   * @version 1.2.2
   * @prop {Object} dayObj A dayjs object for the particular day
   * @prop {Array} appointments List of appointments for this month
   * @prop {Function} handleClick Function to handle clicking on element
   */
  const appsInThisDay = appointments
    ?.filter(
      (app) =>
        dayjs(app.appointment_date).isBetween(
          dayjs(dayObj).startOf('day'),
          dayjs(dayObj).endOf('day')
        ) && app.status === 1
    )
    .sort((a, b) => (a.appointment_date > b.appointment_date ? 1 : -1));

  let occupancy = appsInThisDay.length > 4 ? 'busy' : appsInThisDay > 2 ? 'occupied' : 'available';

  if (dayObj) {
    return (
      <div className="day" onClick={() => handleClick(dayObj)}>
        <span className={dayObj.isToday() ? 'is-today' : null}>{dayObj.format('DD')}</span>
        {appsInThisDay.length ? (
          <div className={'appointment-strip ' + occupancy}>{appsInThisDay.length}</div>
        ) : null}
      </div>
    );
  }
  return <div className="day disabled" />;
}

export function Day({ dayObj, appointments, handleClick }) {
  /**
   * Day component within daily calendar
   *
   * @version 1.2.2
   * @prop {Object} dayObj A dayjs object for the particular day
   * @prop {Array} appointments List of appointments for this month
   * @prop {Function} handleClick Function to handle clicking on element
   */
  let hoursOfDay = [];
  for (let i = 0; i < 24; i++) {
    hoursOfDay.push(dayjs(dayObj).set('hours', i));
  }

  return (
    <div className="day-scrollable-container">
      <div className="day-details">
        <h3 onClick={handleClick}>{dayObj.format(DAY_STRING_FORMAT)}</h3>
      </div>
      <div className="day-hours">
        {hoursOfDay.map((h, i) => (
          <Hour hourObj={h} appointments={appointments} key={i} />
        ))}
      </div>
    </div>
  );
}
