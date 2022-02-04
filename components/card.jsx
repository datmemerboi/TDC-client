import dayjs from 'dayjs';

export const TreatmentCard = function ({ obj, key, clickable, handleClick }) {
  return (
    <div className="output-card" key={key}>
      {obj?.name ? (
        <h3 style={{ fontWeight: 'normal'}}>
          <strong>{obj.name}</strong> ({obj.p_id})
        </h3>
      ) : (
        <h4>{obj.p_id}</h4>
      )}
      <p>
        <strong>{obj.procedure_done || ''}</strong>&nbsp;by&nbsp;<strong>{obj.doctor || ''}</strong>
        &nbsp;on&nbsp;<strong>{dayjs(obj.treatment_date).format('D MMM YYYY') || ''}</strong>
      </p>
      <h4>{obj.t_id}</h4>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <button
          className={clickable ? 'proceed' : 'proceed disabled'}
          onClick={() => handleClick(obj.t_id)}
        >
          Add to invoice
        </button>
      </div>
    </div>
  );
};

export const InvoiceCard = function ({ obj, key, handleClick }) {
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
      <a className="beauty" onClick={() => handleClick(obj.inv_id)}>
        <em>Print Invoice</em>
      </a>
    </div>
  );
};
