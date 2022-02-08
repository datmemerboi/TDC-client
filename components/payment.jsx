import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';

import api from '../utils/api';

export function PaySlip({ list }) {
  const [compatible, setCompatible] = useState(false);
  let url = `/treatment/payment?list=${list.length ? list.join('-') : ''}`;

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

export function PayRow({ data, returnToParent }) {
  let [priceData, setPriceData] = useState({ cost: 1, qty: 1, total: 1 });

  useEffect(
    setPriceData({
      ...priceData,
      total: priceData.cost * priceData.qty
    }),
    [priceData.cost, priceData.qty]
  );

  // useEffect(() => returnToParent({ ...data, ...priceData }), [priceData.total]);

  const handleInput = (e) => {
    let { name, value } = e.target;
    if (!isNaN(value) && isFinite(value)) {
      value = name === 'qty' ? parseInt(value) : parseFloat(value);
      setPriceData({ ...priceData, [name]: value });
    }
  };

  if (!data.procedure_done || !data.treatment_date) {
    return <tr />;
  } else {
    return (
      <Fragment>
        <tr>
          <td className="wide-col-1">
            <span>{data.procedure_done}</span>
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
              value={priceData.cost}
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
              value={priceData.qty}
              onInput={handleInput}
            />
          </td>
          <td>{priceData.total}</td>
        </tr>
      </Fragment>
    );
  }
}
