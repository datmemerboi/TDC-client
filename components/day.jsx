import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

import Hour from './hour';

dayjs.extend(isToday);

const DAY_STRING_FORMAT = 'DD MMM YYYY';

export function WeekDay({ dayObj, clickHandler }) {
  /**
   * Day component within week of a monthly calendar
   *
   * @version 1.2.2
   * @param {Object} dayObj A dayjs object for the particular day
   */
  if (dayObj) {
    return (
      <div className="day" onClick={() => clickHandler(dayObj)}>
        <span className={dayObj.isToday() ? 'is-today' : null}>{dayObj.format('DD')}</span>
      </div>
    );
  }
  return <div className="day disabled" />;
}

export function Day({ dayObj, appointments, clickHandler }) {
  let hoursOfDay = [];
  for (let i = 0; i < 24; i++) {
    hoursOfDay.push(dayjs(dayObj).set('hours', i));
  }

  return (
    <div className="day-scrollable-container">
      <div className="day-details">
        <h3 onClick={clickHandler}>{dayObj.format(DAY_STRING_FORMAT)}</h3>
      </div>
      <div className="day-hours">
        {hoursOfDay.map((h) => (
          <Hour hourObj={h} appointments={appointments} />
        ))}
      </div>
    </div>
  );
}
