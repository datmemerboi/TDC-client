import React, { useEffect } from 'react';
import Month from './month';
import Day from './day';
import Mode from './mode';
import { metaFromStats } from '../common';

import dayjs from 'dayjs';
import api from '../../utils/api';

export default function Calendar() {
  const now = dayjs().add(1, 'month').toDate();
  const [mode, setMode] = React.useState(0);
  const [day, setDay] = React.useState(null);
  const [apps, setApps] = React.useState(null);
  const [meta, setMeta] = React.useState(null);

  var monthObj = {
    now,
    first_day_of_month: dayjs().startOf('month').day(),
    date: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
    words: now.toLocaleString('default', { month: 'short' }),
    number_of_days: dayjs().daysInMonth(),
    start_of_month: dayjs().startOf('month').valueOf(),
    end_of_month: dayjs().endOf('month').valueOf()
    // start_of_month: parseInt(
    //   new Date(new Date(now.getFullYear(), now.getMonth(), 1).setHours(0, 0, 0, 0)).getTime() / 1000
    // ),
    // end_of_month: parseInt(
    //   new Date(new Date(now.getFullYear(), now.getMonth() + 1, 0).setHours(23, 59, 59)).getTime() /
    //     1000
    // )
  };
  /*
  monthObj sample
  {
    "now": "2021-02-10T00:00:00.000Z",
    "first_day_of_month": 1,
    "date": 10,
    "month": 1,
    "year": 2021,
    "words": "Feb",
    "number_of_days": 28,
    "start_of_month": 1612117800,
    "end_of_month": 1614536999
  }
  */
  const bringBackDayObj = (dayObj) => {
    setDay(dayObj);
    setMode(1);
  };
  const switchToMonthMode = () => {
    if (mode === 1) {
      setMode(0);
    }
  };
  useEffect(async () => {
    let { data } = await api.fetchAppointmentsByDate(
      monthObj.start_of_month,
      monthObj.end_of_month
    );
    setApps(data.docs);
    setMeta(metaFromStats(data.meta));
  }, []);

  if (mode === 0) {
    return (
      <React.Fragment>
        <div className="container wide">
          <div className="hold-together">
            <div className="meta-container">{meta}</div>
            <div
              meta="Container to hold mode-container and calendar-container together"
              className="mode-calendar-container"
            >
              <div meta="mode container" className="mode-container">
                <Mode monthObj={monthObj} current={mode} switchToMonthMode={switchToMonthMode} />
              </div>
              <div className="calendar-container">
                <Month monthObj={monthObj} appointments={apps} returnToParent={bringBackDayObj} />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div className="container wide">
          <div className="hold-together">
            <div className="meta-container">{meta}</div>
            <div
              meta="Container to hold mode-container and calendar-container together"
              className="mode-calendar-container"
            >
              <div meta="mode container" className="mode-container">
                <Mode monthObj={monthObj} current={mode} switchToMonthMode={switchToMonthMode} />
              </div>
              <div className="calendar-container">
                <Day dayObj={day} appointments={apps} />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
