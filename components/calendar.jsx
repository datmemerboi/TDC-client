import dayjs from 'dayjs';
import { Fragment, useEffect, useState } from 'react';

import { WeekDay, Day } from './day';
import config from '../config.json';
import api from '../utils/api';

export default function Calendar(props) {
  /**
   * Entire monthly calendar component (with daily view)
   *
   * @version 1.2.2
   * @prop {Date} now A date from the month to be rendered
   */
  const [now, setNow] = useState(props.now || new Date());
  const [choice, setChoice] = useState({ mode: config.CALENDAR_MODES.MONTH_VIEW, chosenDay: now });
  const [appsInThisMonth, setAppsInThisMonth] = useState([]);

  useEffect(async () => {
    let { data } = await api.getAppointmentsByDate(
      dayjs(now).startOf('month').valueOf(),
      dayjs(now).endOf('month').valueOf()
    );
    if (Object.keys(data).length) {
      setAppsInThisMonth(data.docs);
    }
  }, [now]);

  const shiftToPrevMonth = () => setNow(dayjs(now).subtract(1, 'month'));
  const shiftToNextMonth = () => setNow(dayjs(now).add(1, 'month'));

  if (choice.mode === config.CALENDAR_MODES.MONTH_VIEW) {
    let numberOfDaysInMonth = dayjs(now).daysInMonth();
    let blankDaysBeforeMonth = dayjs(now).startOf('month').day() - 1;
    let numberOfCalendarSlots = Math.ceil((numberOfDaysInMonth + blankDaysBeforeMonth) / 7) * 7;

    let monthlyDays = [];
    for (let i = 0; i < numberOfCalendarSlots; i++) {
      /**
       * Basically does: [null, null..., 1st, 2nd, 3rd......null, null]
       */
      if (i <= blankDaysBeforeMonth || i > blankDaysBeforeMonth + numberOfDaysInMonth) {
        monthlyDays.push(null);
      }
      if (i > blankDaysBeforeMonth && i <= blankDaysBeforeMonth + numberOfDaysInMonth) {
        monthlyDays.push(
          dayjs(now)
            .startOf('month')
            .add(i - blankDaysBeforeMonth - 1, 'days')
        );
      }
    }

    let weeks = [];
    for (let j = 0; j < monthlyDays.length; j += 7) {
      /** Splitting days into weeks */
      weeks.push(monthlyDays.slice(j, j + 7));
    }

    return (
      <Fragment>
        <div className="container">
          <div className="mode-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2vmin' }}>
              <span style={{ fontSize: '30px', padding: 0 }} onClick={shiftToPrevMonth}>
                &#8592;
              </span>
              <h3>{dayjs(now).format('MMMM YYYY')}</h3>
              <span style={{ fontSize: '30px', padding: 0 }} onClick={shiftToNextMonth}>
                &#8594;
              </span>
            </div>
            <div className="week-days-header">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((w, i) => (
                <div className="heading" key={i}>
                  <h3>{w}</h3>
                </div>
              ))}
            </div>
          </div>
          <div className="days-container">
            {weeks.map((week, i) => (
              <div className="week" key={i}>
                {week.map((day, j) => (
                  <WeekDay
                    dayObj={day}
                    key={j}
                    appointments={appsInThisMonth}
                    handleClick={() =>
                      setChoice({ mode: config.CALENDAR_MODES.DAY_VIEW, chosenDay: day })
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    );
  } else {
    return (
      <div className="container">
        <Day
          dayObj={choice.chosenDay}
          handleClick={() => setChoice({ mode: config.CALENDAR_MODES.MONTH_VIEW })}
          appointments={appsInThisMonth}
        />
      </div>
    );
  }
}
