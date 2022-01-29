import { Component, Fragment } from 'react';
import { useRouter } from 'next/router';

import api from '../../utils/api';
import config from '../../config.json';

export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treatments: [],
      paymentMethod: config.PAYMENT_METHODS[0],
      paymentID: null,
      subTotal: 0,
      discount: 0,
      grandTotal: 0,
      modalMessage: '',
      triggers: {
        modal: false
      }
    };

    this.discoutHandler = this.discoutHandler.bind(this);
    this.paymentMethodHandler = this.paymentMethodHandler.bind(this);
    this.paymentIDHandler = this.paymentIDHandler.bind(this);
  }

  discoutHandler = (e) => {
    if (isFinite(parseFloat(e.target.value))) {
      this.setState({ discount: parseFloat(e.target.value) });
    }
  };

  paymentMethodHandler = (e) => {
    this.setState({ paymentMethod: e.target.value });
  };
  paymentIDHandler = (e) => {
    this.setState({ paymentID: e.target.value });
  };
  componentDidMount = async () => {
    const router = useRouter(); // useRouter hook will not work in class component
    if (router.query?.invoices) {
      let treatmentData = await Promise.all(router.query.invoices.map(api.getTreatmentData));
      this.setState({ treatments: treatmentData });
    }
  };
  render() {
    return (
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
            {this.state.treatments.length
              ? this.state.treatments.map((obj) => (
                  <Row tid={obj.t_id} treatmentObj={obj} returnToParent={this.getTreatmentCost} />
                ))
              : null}
          </tbody>
        </table>
        <div style={{ position: 'absolute', right: '0' }}>
          <p>Sub Total: {this.state.subTotal.toFixed(2)}</p>
          <label>Discount (%)</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="number"
            min={0}
            className="input-bar small-input-bar"
            style={{ width: '4vw' }}
            onInput={this.discountHandler}
          />
          <p>Grand Total: {this.state.grandTotal.toFixed(2)}</p>
        </div>
        <div>
          <h4>Payment Details</h4>
          <label>Payment method</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <select
            className="input-select"
            style={{ width: '8vw' }}
            onInput={this.paymentMethodHandler}
            defaultValue={this.state.paymentMethod}
          >
            {config.PAYMENT_METHODS.map((method) => (
              <option value={method}>{method}</option>
            ))}
          </select>
          <br />
          <br />
          <label>Payment ID (optional)</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="text" className="input-bar" onInput={this.paymentIDHandler} />
        </div>
        <br />
        <div>
          <button onClick={this.submitHandler} className="primary">
            SUBMIT
          </button>
        </div>
      </div>
    );
  }
}
