import dayjs from 'dayjs';

export const InvoiceCard = function ({ obj, key, returnToParent }) {
  console.log(obj);
  return (
    <div className="output-card" key={key}>
      <h2>{obj.p_id}</h2>
      <h3>{obj.inv_id}</h3>
      {obj.doctor ? (
        <p>
          <strong>Doctor:</strong> {obj.doctor}
        </p>
      ) : null}
      {obj.procedure_done ? (
        <p>
          <strong>Procedure:</strong> {obj.procedure_done}
        </p>
      ) : null}
      {
        <p>
          <strong>Generated on:</strong> {dayjs(obj.created_at).format('D MMM YYYY')}
        </p>
      }
      <a className="beauty" onClick={() => returnToParent(obj.inv_id)}>
        <em>Print Invoice</em>
      </a>
    </div>
  );
};

export const TreatmentCard = function ({ obj, key, onClickHandler }) {
  return (
    <div className="output-card" key={key}>
      <h2>{obj.t_id}</h2>
      <h3>{obj.p_id}</h3>
      {obj.procedure_done ? (
        <p>
          <strong>Procedure:</strong> {obj.procedure_done}
        </p>
      ) : null}
      {obj.doctor ? (
        <p>
          <strong>Doctor:</strong> {obj.doctor}
        </p>
      ) : null}
      {obj.remarks ? (
        <p>
          <strong>Remarks:</strong> {obj.remarks}
        </p>
      ) : null}
      {obj.treatment_date ? (
        <p>
          <strong>Procedure date:</strong> {dayjs(obj.treatment_date).format('D MMM YYYY')}
        </p>
      ) : null}
      <a className="beauty" onClick={() => onClickHandler(obj.t_id)}>
        <em>Create Invoice</em>
      </a>
    </div>
  );
};
