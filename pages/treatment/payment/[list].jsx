import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import NavBar from '../../../components/navbar';
import Modal from '../../../components/modal';
import { PayRow } from '../../../components/payment';
import config from '../../../config.json';
import api from '../../../utils/api';

export default function TreatmentPayment(props) {
  const router = useRouter();

  const [treatments, setTreatments] = useState([]);
  const [total, setTotal] = useState({ sub_total: 0, discount: 0, grand_total: 0 });
  const [payment, setPayment] = useState({});
  const [modal, setModal] = useState({ show: false, message: '' });

  useEffect(async () => {
    let { list } = router.query;
    if (list) {
      let res = await Promise.all(list.split('-').map(api.getTreatmentData));
      let data = res.map(({ data }) => ({ ...data, qty: 1, cost: 1, total: 1 }));
      setTreatments(data);
    }
  }, []);

  useEffect(() => {
    let subTotal = treatments.reduce((acc, t) => {
      if (!isNaN(t.total)) {
        return acc + t.total;
      }
      return acc;
    }, 0);
    let grandTotal = parseFloat(subTotal * (1 - total.discount / 100)).toFixed(2);

    setTotal({ ...total, sub_total: subTotal, grand_total: grandTotal });
  }, [treatments, total.discount]);

  const updatePriceOfTreatment = (index, obj) => {
    let updated = [...treatments]; // Copy original array
    updated.splice(index, 1, obj);
    setTreatments(updated);
  };

  const handleInput = (e) => {
    let { name, value } = e.target;
    if (name === 'payment_method' || name === 'payment_id') {
      setPayment({ ...payment, [name]: value });
      return;
    }
    if (name === 'discount') {
      if (!isNaN(value)) {
        setTotal({ ...total, discount: parseFloat(value) });
        return;
      }
    }
  };

  const handleSubmit = async () => {
    let invoiceObj = {
      p_id: treatments[0].p_id,
      treatments: JSON.parse(JSON.stringify(treatments)),
      payment_method: payment.payment_method,
      payment_id: payment.payment_id ?? null,
      sub_total: total.sub_total,
      discount: total.discount,
      grand_total: total.grand_total
    };

    let { data, error } = await api.createInvoice(invoiceObj);
    if (error?.message) {
      setModal({ show: true, message: error.message });
    } else {
      setModal({ show: true, message: `Invoice created, ID: ${data.inv_id}` });
    }
  };

  return (
    <Fragment>
      <NavBar />
      <div className="container">
        <h3>NEW INVOICE</h3>
        <table>
          <thead>
            <tr>
              <th>Procedure</th>
              <th>Cost</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((data, index) => (
              <PayRow data={data} index={index} returnToParent={updatePriceOfTreatment} />
            ))}
          </tbody>
        </table>

        <div style={{ position: 'absolute', right: '0' }}>
          <p>Sub Total: {total.sub_total}</p>
          <label>Discount (%)</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="number"
            min={0}
            className="input-bar small-input-bar"
            style={{ width: '4vw' }}
            name="discount"
            value={total.discount}
            onInput={handleInput}
          />
          <p>Grand Total: {total.grand_total}</p>
        </div>

        <div>
          <h4>Payment Details</h4>
          <label>Payment method</label>&nbsp;&nbsp;
          <select
            className="input-select"
            style={{ width: '8vw' }}
            name="payment_method"
            onInput={handleInput}
          >
            {config.PAYMENT_METHODS.map((method) => (
              <option value={method}>{method}</option>
            ))}
          </select>
          <br />
          <br />
          <label>Payment ID (optional)</label>&nbsp;&nbsp;
          <input
            type="text"
            className="input-bar"
            name="payment_id"
            value={payment.payment_id}
            onInput={handleInput}
          />
        </div>

        <br />
        <div>
          <button onClick={handleSubmit} className="primary">
            SUBMIT
          </button>
        </div>
      </div>
      <Modal
        show={modal.show}
        message={modal.message}
        clickHandler={() => setModal({ ...modal, show: false })}
      />
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  return { props: {} };
}
