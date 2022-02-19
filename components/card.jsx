import dayjs from 'dayjs';

export const TreatmentCard = function ({ obj, key, clickable, handleClick }) {
  /**
   * Card component for Treatments
   *
   * @version 1.2.2
   * @prop {Object} obj The data object to be rendered as card
   * @prop {Number} key Unique key to identify this DOM element
   * @prop {Boolean} clickable Determines nature of Add to invoice button
   * @prop {Function} handleClick Function to be called upon button click
   */
  return (
    <div className="output-card" key={key}>
      {obj?.name ? (
        <h3 style={{ fontWeight: 'normal' }}>
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

export const InvoiceCard = function ({ obj, handleClick }) {
  /**
   * Card component for Invoices
   *
   * @version 1.2.2
   * @prop {Object} obj The data object to be rendered as card
   * @prop {Function} handleClick Function to be called upon button click
   */
  return (
    <div className="output-card">
      <h3 style={{ fontWeight: 'normal' }}>
        <strong>{obj.name}</strong> ({obj.p_id})
      </h3>
      {obj.doctor && obj.doctor.length ? (
        <p>
          <strong>Doctor:</strong> {obj.doctor.join(', ')}
        </p>
      ) : null}
      {obj.treatments ? (
        <p>
          <strong>Procedures:</strong>{' '}
          {obj.treatments.map(({ procedure_done }) => procedure_done).join(', ')}
        </p>
      ) : null}
      <p>
        <strong>Generated on:</strong> {dayjs(obj.created_at).format('D MMM YYYY')}
      </p>
      <h4>{obj.inv_id}</h4>
      <button className="proceed" onClick={() => handleClick(obj.inv_id)}>
        Print Invoice
      </button>
    </div>
  );
};
