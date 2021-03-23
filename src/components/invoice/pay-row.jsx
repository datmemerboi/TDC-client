import React, { useEffect } from 'react';
const config = require('../../config')[process.env.NODE_ENV ?? "dev"];

export default class Row extends React.Component {
  constructor(props) {
    super(props);
    this.tid = props.tid;
    this.treatmentObj = props.treatmentObj;
    this.state = {
      cost: 1,
      qty: 1,
      total: 1
    };
    this.costHandler = this.costHandler.bind(this);
    this.qtyHandler = this.qtyHandler.bind(this);
    this.totalHandler = this.totalHandler.bind(this);
  };
  totalHandler = () => {
    if (this.state.cost && this.state.qty) {
      this.setState(
        {
          total: parseFloat(this.state.cost * this.state.qty)
        },
        () => {
          return this.props.returnToParent({
            tid: this.tid,
            cost: this.state.cost,
            qty: this.state.qty,
            total: this.state.total
          })
        }
      );
    } else {
      this.setState(
        {
          total: this.state.cost
        },
        () => {
          return this.props.returnToParent({
            tid: this.tid,
            cost: this.state.cost,
            qty: this.state.qty,
            total: this.state.total
          })
        }
      );
    }
  };
  costHandler = (event) => {
    if (!isNaN(parseFloat(event.target.value))) {
      this.setState(
        {
          cost: parseFloat(event.target.value)
        },
        this.totalHandler
      );
    }
  };
  qtyHandler = (event) => {
    if (!isNaN(parseFloat(event.target.value))) {
      this.setState(
        {
          qty: parseFloat(event.target.value)
        },
        this.totalHandler
      );
    }
  };
  componentDidMount() {
    this.totalHandler();
  }
  render() {
    return (
      <React.Fragment>
        <tr>
          <td className="wide-col-1">
            <span>{this.treatmentObj.procedure_done}</span><br/>
            <span>{new Date(this.treatmentObj.treatment_date).toLocaleString("default", { day: "numeric", month: "short", year: "numeric" })}</span><br/>
            {
              this.treatmentObj?.teeth_num && this.treatmentObj.teeth_num?.length
              ?
                <span>{this.treatmentObj.teeth_num.join(',')}</span>
              :
                null
            }
          </td>
          <td>
            <input
              type="number"
              className="input-bar small-input-bar"
              min={1}
              onInput={this.costHandler}
              defaultValue={this.state.cost}
            />
          </td>
          <td className="thin-col">
            <input
              type="number"
              min={0}
              className="input-bar small-input-bar"
              style={{ width: "2vw" }}
              onInput={this.qtyHandler}
              defaultValue={this.state.qty}
            />
          </td>
          <td>
            <span>{this.state.total}</span>
          </td>
        </tr>
      </React.Fragment>
    );
  };
};
