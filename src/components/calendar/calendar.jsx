import React, { useEffect } from 'react';
import Month from './month';
import Day from './day';
import Mode from './mode';
import { metaFromStats } from '../common';
const config = require('../../config.json')[process.env.NODE_ENV];

export default function Calendar() {
  const now = new Date();
  const [mode, setMode] = React.useState(0);
  const [day, setDay] = React.useState(null);
  const [apps, setApps] = React.useState(null);
  const [meta, setMeta] = React.useState(null);

  var monthObj = {
    now: now,
    start_day: new Date(now.getFullYear(), now.getMonth(), 1).getDay(),
    date: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
    words: now.toLocaleString('default', { "month": "short" }),
    number_of_days: new Date(now.getFullYear(), now.getMonth()+1,0).getDate(),
    start_of_month: parseInt(new Date(new Date(now.getFullYear(),now.getMonth(),1).setHours(0,0,0,0)).getTime()/1000),
    end_of_month: parseInt(new Date(new Date(now.getFullYear(),now.getMonth()+1,0).setHours(23,59,59)).getTime()/1000)
  }
  /*
  monthObj sample
  {
    "now": "2021-02-10T00:00:00.000Z",
    "start_day": 1,
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
  }
  const switchToMonthMode = () => {
    if (mode === 1) {
      setMode(0);
    }
  }
  useEffect(() => {
    var url = process.env?.REACT_APP_ENVIRONMENT === "local"
      ? `/api/appointment/all/?from=${monthObj.start_of_month}&to=${monthObj.end_of_month}`
      : config.API_URL + `/api/appointment/all/?from=${monthObj.start_of_month}&to=${monthObj.end_of_month}`
    fetch(url)
      .then(res => res.json())
      .then(res => {
        setApps(res.docs);
        setMeta(metaFromStats(res.meta));
      })
      .catch(err => console.error(err))
  }, [])

  if (mode === 0) {
    return (
      <React.Fragment>
        <div className="container wide">
          <div className="hold-together">
          <div className="meta-container">
            {meta}
          </div>
          <div meta="Container to hold mode-container and calendar-container together" className="mode-calendar-container">
            <div meta="mode container" className="mode-container">
              <Mode monthObj={monthObj} current={mode} switchToMonthMode={switchToMonthMode}/>
            </div>
            <div className="calendar-container">
              <Month monthObj={monthObj} appointments={apps} returnToParent={bringBackDayObj}/>
            </div>
          </div>
          </div>
        </div>
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <div className="container wide">
          <div className="hold-together">
          <div className="meta-container">
            {meta}
          </div>
          <div meta="Container to hold mode-container and calendar-container together" className="mode-calendar-container">
            <div meta="mode container" className="mode-container">
              <Mode monthObj={monthObj} current={mode} switchToMonthMode={switchToMonthMode}/>
            </div>
            <div className="calendar-container">
              <Day dayObj={day} appointments={apps}/>
            </div>
          </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
