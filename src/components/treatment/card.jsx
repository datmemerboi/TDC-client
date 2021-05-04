import React from 'react';

export default function Card({ obj, key, onClickHandler }) {
  return (
    <div className="output-card" key={key}>
      <h2>{obj.t_id}</h2>
      <h3>{obj.p_id}</h3>
      {
        obj.procedure_done
        ?
          <p><strong>Procedure:</strong> {obj.procedure_done}</p>
        : null
      }
      {
        obj.doctor
        ?
          <p><strong>Doctor:</strong> {obj.doctor}</p>
        : null
      }
      {
        obj.remarks
        ?
          <p><strong>Remarks:</strong> {obj.remarks}</p>
        : null
      }
      {
        obj.treatment_date
        ?
          <p><strong>Procedure date:</strong> {
            new Date(obj.treatment_date).toLocaleDateString(
              "en-gb",
              {
                year: "numeric",
                month: "short",
                day: "numeric"
              })
          }</p>
        : null
      }
      <a className="beauty" onClick={() => onClickHandler(obj.t_id)}><em>Create Invoice</em></a>
    </div>
  );
}
