import React from 'react';
import MonthlyDay from './monthly-day';
import { dayObjArrayFromMonthObj } from '../common';

export default function Month(props) {
  const monthObj = props.monthObj;
  var dayObjArray = dayObjArrayFromMonthObj(monthObj);
  // Mapping dayObjArray (of dayObj) into weeksArray (of dayObj)
  const weeksArray = [];
  for (let i = 0; i < dayObjArray.length; i += 7) {
    weeksArray.push(
      <div className="week">
        <MonthlyDay dayObj={dayObjArray[i]} key={i} appointments={props.appointments} returnToParent={props.returnToParent} />
        <MonthlyDay dayObj={dayObjArray[i+1]} key={i+1} appointments={props.appointments} returnToParent={props.returnToParent} />
        <MonthlyDay dayObj={dayObjArray[i+2]} key={i+2} appointments={props.appointments} returnToParent={props.returnToParent} />
        <MonthlyDay dayObj={dayObjArray[i+3]} key={i+3} appointments={props.appointments} returnToParent={props.returnToParent} />
        <MonthlyDay dayObj={dayObjArray[i+4]} key={i+4} appointments={props.appointments} returnToParent={props.returnToParent} />
        <MonthlyDay dayObj={dayObjArray[i+5]} key={i+5} appointments={props.appointments} returnToParent={props.returnToParent} />
        <MonthlyDay dayObj={dayObjArray[i+6]} key={i+6} appointments={props.appointments} returnToParent={props.returnToParent} />
      </div>
      )
  }
  return (
    <React.Fragment>
      <div className="week-days-header">
        <div className="heading" key="Sun"><h3>Sun</h3></div>
        <div className="heading" key="Mon"><h3>Mon</h3></div>
        <div className="heading" key="Tue"><h3>Tue</h3></div>
        <div className="heading" key="Wed"><h3>Wed</h3></div>
        <div className="heading" key="Thu"><h3>Thu</h3></div>
        <div className="heading" key="Fri"><h3>Fri</h3></div>
        <div className="heading" key="Sat"><h3>Sat</h3></div>
      </div>
      <div className="days-container">
        {weeksArray}
      </div>
    </React.Fragment>
  );
}
