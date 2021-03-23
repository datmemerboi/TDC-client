import React from 'react';

export default function Card({ obj, key, onClickHandler }) {
  return (
    <div className="output-card" key={key}>
      <h2>{obj.t_id}</h2>
      <h3>{obj.p_id}</h3>
      {obj?.procedure_done ? <p><b>Procedure:</b> {obj.procedure_done}</p> : null}
      {obj?.doctor ? <p><b>Doctor:</b> {obj.doctor}</p> : null}
      {obj?.remarks ? <p><b>Remarks:</b> {obj.remarks}</p> : null}
      {obj?.treatment_date ? <p><b>Procedure date:</b> {new Date(obj.treatment_date).toLocaleDateString('en-gb', { year: 'numeric', month: 'short', day: 'numeric' })}</p> : null}
      <a className="beauty" onClick={() => onClickHandler(obj.t_id)}><i>Create Invoice</i></a>
    </div>
  );
}
