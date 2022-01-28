import dayjs from 'dayjs';

export default function InvoiceCard({ obj, key, returnToParent }) {
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
          <strong>Generated on: </strong>
          {dayjs(obj.created_at).format('D MMM YYYY')}
        </p>
      }
      <a className="beauty" onClick={() => returnToParent(obj.inv_id)}>
        <em>Print Invoice</em>
      </a>
    </div>
  );
}
