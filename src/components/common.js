import React from 'react';
import Teeth from './teeth.jsx';

export const trFromPatList = (list) => {
  if (!list.length) {
    return null;
  } else {
    let rows = list.map((obj, index) => {
      return (
        <tr key={index+1}>
          <td className="thin-col">{index+1}.</td>
          <td>{obj.p_id}</td>
          <td>{obj.name}</td>
          {obj.gender && obj.age ? <td className="thin-col">{`${obj.gender}/${obj.age}`}</td> : <td />}
          <td>{obj.contact}</td>
          {obj.area ? <td>{obj.area}</td> : <td />}
          {obj.med_history ? <td>{obj.med_history.join(',')}</td> : <td />}
        </tr>
      );
    });
    return rows;
  }
}

export const dayObjArrayFromMonthObj = (monthObj) => {
  /*
  returns [
    {
      "date": 28,
      "day": 0,
      "month": 1,
      "year": 2021,
      "from": 1614450600,
      "to": 1614536999,
      "date_string": "2021-2-28",
      "is_today": false
    },...]
  */
  const dayObjArray = [];
  switch(monthObj.start_day) {
    case 1:
      dayObjArray.push(null);
      break;
    case 2:
      dayObjArray.push(null,null);
      break;
    case 3:
      dayObjArray.push(null,null,null);
      break;
    case 4:
      dayObjArray.push(null,null,null,null);
      break;
    case 5:
      dayObjArray.push(null,null,null,null,null);
      break;
    case 6:
      dayObjArray.push(null,null,null,null,null,null);
      break;
    default: break;
  }
  for (let i = 1; i <= monthObj.number_of_days; i++) {
    let d = new Date(monthObj.year, monthObj.month, i);
    var dayObj = {
      date: i,
      day: d.getDay(),
      month: monthObj.month,
      year: monthObj.year,
      start_of_day: parseInt(new Date(new Date(d).setHours(0,0,0)).getTime()/1000),
      end_of_day: parseInt(new Date(new Date(d).setHours(23,59,59)).getTime()/1000),
      date_string: `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
    };
    dayObj.is_today = new Date().setHours(0,0,0,0) === d.getTime();
    dayObjArray.push(dayObj);
  }

  if(dayObjArray.length % 7 !== 0) {
    let trailingDaysInMonth = parseInt(7 - dayObjArray.length % 7);
    for (let i = 0; i < trailingDaysInMonth; i++) {
      dayObjArray.push(null);
    }
  }
  return dayObjArray;
};

export const hourObjArrayFromDayObj = (dayObj) => {
  /*
  {
    "date": 28,
    "day": 0,
    "month": 1,
    "year": 2021,
    "from": 1614450600,
    "to": 1614536999,
    "date_string": "2021-2-28",
    "is_today": false
  }
  */
  const hourObjArray = [];
  for (let i = 0; i < 24; i++) {
    let hourObj = {
      day: dayObj.day,
      date: dayObj.date,
      month: dayObj.month,
      year: dayObj.year,
      hour: i,
      start_of_hour: parseInt(new Date(dayObj.year, dayObj.month, dayObj.date).setHours(i,0,0)/1000),
      end_of_hour: parseInt(new Date(dayObj.year, dayObj.month, dayObj.date).setHours(i,59,59)/1000),
      start_iso_string: new Date(new Date(dayObj.year, dayObj.month, dayObj.date).setHours(i,0,0,0)).toISOString(),
      end_iso_string: new Date(new Date(dayObj.year, dayObj.month, dayObj.date).setHours(i,59,59,99)).toISOString(),
      words: new Date(new Date(dayObj.year, dayObj.month, dayObj.date).setHours(i,0,0,0)).toLocaleString("en-US", { hour: "numeric", hour12: true })
    };
    hourObj.disabled = hourObj.hour <= 7 || hourObj.hour >= 21;
    hourObjArray.push(hourObj);
  }
  return hourObjArray;
}

export const metaFromStats = (stats) => {
  if (!stats || !stats.length) {
    return <p>No stats to display</p>;
  } else {
    let doctorStats = stats.filter(s => s.type === "doctor");
    let statusStats = stats.filter(s => s.type === "status");
    if (doctorStats.length < 1 && statusStats.length < 1) {
      return <p>No stats to display</p>;
    }
    if (doctorStats.length) {
      doctorStats = doctorStats.map((s,i) => <p key={i}><em>{s.name}</em>: {s.count} appointment(s) in this month</p>);
    }
    if (statusStats.length) {
      statusStats = statusStats.map((s,i) => {
        switch (s.value) {
          case 0:
            return <p key={i}>Cancelled appointments: <strong>{s.count}</strong></p>;
          case 1:
            return <p key={i}>Scheduled appointments: <strong>{s.count}</strong></p>;
          case 2:
            return <p key={i}>Completed appointments: <strong>{s.count}</strong></p>;
          case 3:
            return <p key={i}>Postponed appointments: <strong>{s.count}</strong></p>;
        }
      });
    }
    return (
      <React.Fragment>
        {doctorStats.length ? doctorStats : null}
        {statusStats.length ? statusStats: null }
      </React.Fragment>
    )
  }
}

export const arrangementFromTeethNumbering = (tn, clickHandler) => {
  if (!tn.RU || !tn.LU || !tn.RL || !tn.LL) {
    return [];
  } else {
    // RU
    let ru = tn.RU.map(num => <Teeth number={num} returnToParent={clickHandler} />);
    // LU
    let lu = tn.LU.map(num => <Teeth number={num} returnToParent={clickHandler} />);
    // RL
    let rl = tn.RL.map(num => <Teeth number={num} returnToParent={clickHandler} />);
    // LL
    let ll = tn.LL.map(num => <Teeth number={num} returnToParent={clickHandler} />);
    let urow = <div className="teeth-row">{ru}{lu}</div>;
    let lrow = <div className="teeth-row">{rl}{ll}</div>;
    return <div className="teeth-container">{urow}{lrow}</div>;
  }
}

export const filterAppointmentsForDay = (apps, startOfDay, endOfDay) => {
  if (apps && apps.length && startOfDay && endOfDay) {
    return apps.filter(app => {
      let d = parseInt(new Date(app.appointment_date).getTime()/1000);
      return d >= startOfDay && d <= endOfDay;
    });
  } else {
    return [];
  }
}

export const filterAppointmentsForHour = (apps, startOfHour, endOfHour) => {
  return apps.filter(app => {
    let d = parseInt(new Date(app.appointment_date).getTime()/1000);
    return d >= startOfHour && d <= endOfHour;
  })
}

export const everyFifteenMinsOfHour = (startOfHour) => {
  return Array.from({ length: 4 }, (_,i) => {
    let d = new Date((startOfHour*1000)+(i*900000));
    return {
      words: d.toLocaleString("default", { hour: "numeric", minute: "numeric" }),
      value: parseInt(d.getTime()/1000)
    };
  });
}
