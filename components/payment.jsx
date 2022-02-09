import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';

import api from '../utils/api';

export function PaySlip({ list }) {
  const [compatible, setCompatible] = useState(false);
  let url = `/treatment/payment/${list.length ? list.join('-') : ''}`;

  useEffect(async () => {
    console.log(list);
    let { data } = await api.checkCompatibility(list); // Check compatibility
    if (data && Object.prototype.hasOwnProperty.call(data, 'compatible')) {
      setCompatible(data.compatible);
    }
  }, [list]);

  if (list.length) {
    return (
      <Fragment>
        <div className="meta-container right">
          {!compatible ? (
            <p style={{ color: '#C31532' }}>
              Cannot create invoice for different patients / doctors
            </p>
          ) : null}
          {list.length === 3 ? (
            <p>
              Maximum <strong>3 treatments</strong> only
            </p>
          ) : null}
          <ul>
            {list?.map((id, i) => (
              <li key={i}>{id}</li>
            ))}
          </ul>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              padding: '1vmin'
            }}
          >
            {compatible && (
              <Link href={url}>
                <button className="proceed">Payment &#x2192;</button>
              </Link>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
  return null;
}

export function PayRow({ tid, returnToParent }) {
  let [treatmentData, setTreatmentData] = useState({});
  let [price, setPrice] = useState({ cost: 1, qty: 1, total: 1 });

  useEffect(async () => {
    // Fetch data upon mount
    if (tid && Object.keys(treatmentData).length === 0) {
      let { data } = await api.getTreatmentData(tid);
      if (Object.keys(data).length) {
        setTreatmentData(data);
      }
    }
  }, []);

  useEffect(() => {
    if (price.cost > -1 && price.qty > -1) {
      setPrice({
        ...price,
        total: price.cost * price.qty
      });
      returnToParent(tid, price.cost * price.qty);
    }
  }, [price.cost, price.qty]);

  const handleInput = (e) => {
    let { name, value } = e.target;
    if (!isNaN(value) && isFinite(value)) {
      value = name === 'qty' ? parseInt(value) : parseFloat(value);
      setPrice({ ...price, [name]: value });
    }
  };

  if (!treatmentData.procedure_done || !treatmentData.treatment_date) {
    return <tr />;
  } else {
    return (
      <Fragment>
        <tr>
          <td className="wide-col-1">
            <span>{treatmentData.procedure_done}</span>
            <br />
            <span>{dayjs(treatmentData.treatment_date).format('D MMM YYYY')}</span>
            <br />
            {treatmentData?.teeth_num && treatmentData.teeth_num?.length ? (
              <span>{treatmentData.teeth_num.join(',')}</span>
            ) : null}
          </td>
          <td>
            <input
              type="number"
              className="input-bar small-input-bar"
              min={1}
              name="cost"
              value={price.cost}
              onInput={handleInput}
            />
          </td>
          <td className="thin-col">
            <input
              type="number"
              className="input-bar small-input-bar"
              min={0}
              style={{ width: '2vw' }}
              name="qty"
              value={price.qty}
              onInput={handleInput}
            />
          </td>
          <td>{price.total}</td>
        </tr>
      </Fragment>
    );
  }
}
