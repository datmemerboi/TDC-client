import React from 'react';

export default function Card({ obj, key, returnToParent }) {
  return (
    <div className="output-card" key={key}>
      <h2>{obj.inv_id}</h2>
      <h3>{obj.p_id}</h3>
      {
        obj?.doctor
        ?
          <p><strong>Doctor:</strong> {obj.doctor}</p>
        :
          null
      }
      {
        obj?.procedure_done
        ?
          <p><strong>Procedure:</strong> {obj.procedure_done}</p>
        :
          null
      }
      {<p><strong>Generated on:</strong> {new Date(obj.created_at).toLocaleDateString('default', { year: 'numeric', month: 'short', day: 'numeric' })}</p>}
      <a
        className="beauty"
        onClick={() => returnToParent(obj.inv_id)}
      >
        <em>Print Invoice</em>
      </a>
    </div>
  )
}
