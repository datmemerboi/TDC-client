import React from 'react';
import Row from './pay-row';
import Modal from '../modal';
import config from '../../config.json';

export default class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treatments: [],
      paymentMethod: config.PAYMENT_METHODS[0],
      paymentID: null,
      subTotal: 0,
      discount: 0,
      grandTotal: 0,
      modalMessage: "",
      triggers: {
        modal: false
      }
    };
    this.discountHandler = this.discountHandler.bind(this);
    this.paymentMethodHandler = this.paymentMethodHandler.bind(this);
    this.getTreatmentObj = this.getTreatmentObj.bind(this);
    this.getTreatmentCost = this.getTreatmentCost.bind(this);
    this.calculateGrandTotal = this.calculateGrandTotal.bind(this);
    this.paymentIDHandler = this.paymentIDHandler.bind(this);
  };
  discountHandler = (event) => {
    if (!isNaN(parseFloat(event.target.value))) {
      this.setState(
        {
          discount: parseFloat(event.target.value)
        },
        this.calculateGrandTotal
      );
    }
  };
  paymentMethodHandler = (event) => {
    this.setState({ paymentMethod: event.target.value });
  };
  paymentIDHandler = (event) => {
    this.setState({ paymentID: event.target.value });
  }
  getTreatmentCost = ({ tid, cost, qty, total }) => {
    let treatments = this.state.treatments;
    let treatmentObj = treatments.filter(obj => obj.t_id === tid)[0];
    let index = treatments.indexOf(treatmentObj);
    if (treatmentObj && index > -1) {
      treatments[index] = { ...treatmentObj, cost, qty, total };
      this.setState({ treatments: treatments }, this.calculateGrandTotal);
    }
  };
  calculateGrandTotal = () => {
    var subTotal = this.state.treatments
      .map(obj => obj.total)
      .reduce((a,b) => a + b, 0);
    var discount = this.state.discount,
        grandTotal = subTotal-(subTotal * parseFloat(discount)/100);
    this.setState({
      subTotal: subTotal,
      grandTotal: grandTotal
    });
  };
  getTreatmentObj = (tid) => {
    let url = process.env.REACT_APP_ENVIRONMENT === "local"
      ? `/api/treatment/get/${tid}`
      : config.API_URL + `/api/treatment/get/${tid}`;
    fetch(url)
      .then(res => {
        if (res.status === 200) { return res.json() } else { throw res.status };
      })
      .then(res => {
        let treatments = this.state.treatments;
        treatments.push(res);
        this.setState({ treatments: treatments });
      })
      .catch(err => {
        console.error(err);
      });
  };
  submitHandler = () => {
    if (!this.state.subTotal || !this.state.paymentMethod) {
      this.setState(state => {
        return ({
          triggers: {
            ...state.triggers,
            modal: true
          },
          modalMessage: "Sub Total, Payment Mode cannot be empty"
        });
      });
    } else {
      let invoiceObj = {
        p_id: this.state.treatments[0].p_id,
        treatments: this.state.treatments,
        payment_method: this.state.paymentMethod,
        payment_id: this.state.paymentID ? this.state.paymentID : null,
        sub_total: this.state.subTotal,
        discount: this.state.discount,
        grand_total: this.state.grandTotal
      };
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(invoiceObj)
      };
      var url = process.env.REACT_APP_ENVIRONMENT === "local"
        ? `/api/invoice/new/`
        : config.API_URL + `/api/invoice/new/`;
      // console.log(JSON.stringify(invoiceObj, null, 4), url);
      fetch(url, options)
        .then(res => {
          if (res.status === 201) { return res.json(); } else { throw res.status };
        })
        .then(res => {
          this.setState(state => {
            return ({
              triggers: {
                ...state.triggers,
                modal: true
              },
              modalMessage: `Invoice ID: ${res.inv_id}`
            });
          });
        })
        .catch(err => {
          console.error(err);
          this.setState(state => {
            return ({
              triggers: {
                ...state.triggers,
                modal: true
              },
              modalMessage: "Some error occurred! Please try again."
            });
          });
        })
    }
  }
  componentDidMount(props) {
    if (this.props.location.state?.invoiceList) {
      this.props.location.state.invoiceList.map(this.getTreatmentObj);
    }
  };
  render() {
    return (
      <React.Fragment>
      <div className="container">
        <h3>NEW INVOICE</h3>
        <table>
          <thead>
            <tr>
              <th>
                Procedures
              </th>
              <th>
                Cost
              </th>
              <th>
                Qty
              </th>
              <th>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.treatments.length
            ?
              this.state.treatments
                .map(obj => <Row tid={obj.t_id} treatmentObj={obj} returnToParent={this.getTreatmentCost} />)
            :
              null
          }
          </tbody>
        </table>
        <div style={{ position: "absolute", right: "0" }}>
          <p>Sub Total: {this.state.subTotal.toFixed(2)}</p>
          <label>Discount (%)</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="number"
            min={0}
            className="input-bar small-input-bar"
            style={{ width: "4vw" }}
            onInput={this.discountHandler}
          />
          <p>Grand Total: {this.state.grandTotal.toFixed(2)}</p>
        </div>
        <div>
          <h4>Payment Details</h4>
          <label>Payment method</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <select
            className="input-select"
            style={{ width: "8vw" }}
            onInput={this.paymentMethodHandler}
            defaultValue={this.state.paymentMethod}
          >
            {
              config.PAYMENT_METHODS
                .map(method => <option value={method}>{method}</option>)
            }
          </select>
          <br/><br/>
          <label>Payment ID (optional)</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="text"
            className="input-bar"
            onInput={this.paymentIDHandler}
          />
          </div><br/>
        <div>
          <button onClick={this.submitHandler} className="primary">SUBMIT</button>
        </div>
      </div>
      <Modal
        show={this.state.triggers.modal}
        message={this.state.modalMessage}
        onClickHandler={() => {
          this.setState({
            triggers: {
              ...this.state.triggers,
              modal: false
            }
          })
        }}
      />
      </React.Fragment>
    );
  };
};
