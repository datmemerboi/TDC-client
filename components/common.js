import React from 'react';
import Teeth from './teeth.jsx';

export function tableRowFromPatientList(list) {
  if (!list.length) {
    return null;
  } else {
    let rows = list.map((obj, index) => {
      return (
        <tr key={index + 1}>
          <td className="thin-col">{index + 1}.</td>
          <td>{obj.p_id}</td>
          <td>{obj.name}</td>
          <td className="thin-col">{`${obj.gender ?? ''}/${obj.age ?? ''}`}</td>
          <td>{obj.contact}</td>
          {obj.area ? <td>{obj.area}</td> : <td />}
          {obj.med_history && obj.med_history.length ? (
            <td>{obj.med_history.join(',')}</td>
          ) : (
            <td />
          )}
        </tr>
      );
    });
    return rows;
  }
}

export function metaFromStats(stats) {
  if (!stats || !stats.length) {
    return <p>No stats to display</p>;
  } else {
    let doctorStats = stats.filter((s) => s.type === 'doctor');
    let statusStats = stats.filter((s) => s.type === 'status');
    if (doctorStats.length < 1 && statusStats.length < 1) {
      return <p>No stats to display</p>;
    }
    if (doctorStats.length) {
      doctorStats = doctorStats.map((s, i) => (
        <p key={i}>
          <em>{s.name}</em>: {s.count} appointment(s) in this month
        </p>
      ));
    }
    if (statusStats.length) {
      statusStats = statusStats.map((s, i) => {
        switch (s.value) {
          case 0:
            return (
              <p key={i}>
                Cancelled appointments: <strong>{s.count}</strong>
              </p>
            );
          case 1:
            return (
              <p key={i}>
                Scheduled appointments: <strong>{s.count}</strong>
              </p>
            );
          case 2:
            return (
              <p key={i}>
                Completed appointments: <strong>{s.count}</strong>
              </p>
            );
          case 3:
            return (
              <p key={i}>
                Postponed appointments: <strong>{s.count}</strong>
              </p>
            );
        }
      });
    }
    return (
      <React.Fragment>
        {doctorStats.length ? doctorStats : null}
        {statusStats.length ? statusStats : null}
      </React.Fragment>
    );
  }
}

export function arrangementFromTeethNumbering(tn, clickHandler) {
  if (!tn.RU || !tn.LU || !tn.RL || !tn.LL) {
    return [];
  } else {
    // RU
    let ru = tn.RU.map((num) => <Teeth number={num} returnToParent={clickHandler} />);
    // LU
    let lu = tn.LU.map((num) => <Teeth number={num} returnToParent={clickHandler} />);
    // RL
    let rl = tn.RL.map((num) => <Teeth number={num} returnToParent={clickHandler} />);
    // LL
    let ll = tn.LL.map((num) => <Teeth number={num} returnToParent={clickHandler} />);
    let urow = (
      <div className="teeth-row">
        {ru}
        {lu}
      </div>
    );
    let lrow = (
      <div className="teeth-row">
        {rl}
        {ll}
      </div>
    );
    return (
      <div className="teeth-container">
        {urow}
        {lrow}
      </div>
    );
  }
}
