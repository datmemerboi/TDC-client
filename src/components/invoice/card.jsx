import React from 'react';

export default function Card({ obj, key, returnToParent }) {
  return (
    <div className="output-card" key={key}>
      <h2>{obj.inv_id}</h2>
      <h3>{obj.p_id}</h3>
      {
        obj?.doctor
        ?
          <p><b>Doctor:</b> {obj.doctor}</p>
        :
          null
      }
      {
        obj?.procedure_done
        ?
          <p><b>Procedure:</b> {obj.procedure_done}</p>
        :
          null
      }
      {<p><b>Generated on:</b> {new Date(obj.created_at).toLocaleDateString('default', { year: 'numeric', month: 'short', day: 'numeric' })}</p>}
      <a
        className="beauty"
        onClick={() => returnToParent(obj.inv_id)}
      >
        <i>Print Invoice</i>
      </a>
    </div>
  )
}
