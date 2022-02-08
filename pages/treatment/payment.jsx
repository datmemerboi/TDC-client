import { Component, Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import api from '../../utils/api';
import config from '../../config.json';
import { PayRow } from '../../components/payment';

export default function TreatmentPayment() {
  const router = useRouter();
  const initialDataFetch = async () => {
    if (router.query?.list) {
      let docs = await Promise.all(router.query.list.split('-').map(api.getTreatmentData));
      return docs.map(({ data }) => data);
    }
    return [];
  };

  const [treatments, setTreatments] = useState([
    {
      procedure_done: 'Filling',
      teeth_number: [],
      remarks: '',
      p_id: 'PAT0013',
      treatment_date: '2018-09-14T00:00:00.000Z',
      doctor: 'Dr. Gayathri',
      t_id: 'TRT0017',
      created_at: '2021-06-29T06:26:13.076Z',
      name: 'Adhithya',
      qty: 1,
      cost: 1,
      total: 1
    }
  ]);
  // const [payment, setPayment] = useState({ method: config.PAYMENT_METHODS[0], id: null });
  const [total, setTotal] = useState({
    sub_total: 0,
    grand_total: 0,
    discount: 0
  });

  useEffect(async () => {
    if (treatments.length === 0) {
      let data = await initialDataFetch();
      // setTreatments(data);
      /**
       *
       * Setting state within useEffect throws Infinite re-renders error!
       *
       */
      console.log(JSON.stringify(data, null, 1));
    }
  }, [total]);

  const handleInput = (e) => {
    let { name, value } = e.target;
    if (name === 'discount') {
      value = parseFloat(value);
    }
  };

  const updatePriceOfTreatment = (returned) => {
    let index = treatments.indexOf(treatments.find((t) => t.t_id === returned.t_id));

    let updatedTreatments = treatments;
    updatedTreatments.splice(index, 1, returned);
    setTreatments(updatedTreatments);

    let computedSubTotal = treatments.reduce((acc, t) => acc + t.total || 0, 0);
    setTotal({ ...total, sub_total: computedSubTotal });
  };

  return (
    <Fragment>
      <div className="container">
        <h3>NEW INVOICE</h3>
        <table>
          <thead>
            <tr>
              <th>Procedures</th>
              <th>Cost</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((t, i) => (
              <tr>{t.procedure_done}</tr>
            ))}
          </tbody>
        </table>
        <p>Sub total: {total.sub_total}</p>
      </div>
    </Fragment>
  );
}
