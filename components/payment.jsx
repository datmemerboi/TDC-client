import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';

import api from '../utils/api';

export function PaySlip({ list }) {
  /**
   * Component to render quick payment slip before entering payment details
   *
   * @version 1.2.2
   * @prop {Array} list The list of treatments to create invoice
   */
  const [compatible, setCompatible] = useState(false);
  let url = `/treatment/payment/${list.length ? list.join('-') : ''}`;

  useEffect(async () => {
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
          {list.length === 4 ? (
            <p>
              Maximum <strong>4 treatments</strong> only
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

export function PayRow({ data, index, returnToParent }) {
  /**
   * Component to render a single table row while entering payment details
   *
   * @version 1.2.2
   * @prop {Object} data The treatment object to add payment info
   * @prop {Number} index Index of the particular data object
   * @prop {Function} returnToParent Function to be called upon any state change
   */
  const [cost, setCost] = useState(1);
  const [qty, setQty] = useState(1);

  useEffect(async () => {
    if (cost > -1 && qty > -1) {
      returnToParent(index, {
        ...data,
        cost: cost,
        qty: qty,
        total: cost * qty
      });
    }
  }, [cost, qty]);

  const handleInput = (e) => {
    let { name, value } = e.target;
    if (!isNaN(value) && isFinite(value)) {
      if (name === 'qty') {
        setQty(parseInt(value));
      }
      if (name === 'cost') {
        setCost(parseFloat(value));
      }
    }
  };

  if (!data.procedure_done || !data.treatment_date) {
    return <tr />;
  } else {
    return (
      <Fragment>
        <tr>
          <td className="wide-col-1">
            <span>{data.procedure_done.trim()}</span>
            <br />
            <span>{dayjs(data.treatment_date).format('D MMM YYYY')}</span>
            <br />
            {data?.teeth_num && data.teeth_num?.length ? (
              <span>{data.teeth_num.join(',')}</span>
            ) : null}
          </td>
          <td>
            <input
              type="number"
              className="input-bar small-input-bar"
              min={1}
              name="cost"
              value={cost}
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
              value={qty}
              onInput={handleInput}
            />
          </td>
          <td>{isFinite(qty) && isFinite(cost) ? qty * cost : 0}</td>
        </tr>
      </Fragment>
    );
  }
}
