import React from 'react';
import { Link } from 'react-router-dom';
import Card from './card';
import config from '../../config.json';

export default class TreatmentSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: null,
      type: "PID",
      searchResult: null,
      invoiceList: [],
      compatible: true
    };
    this.searchInputHandler = this.searchInputHandler.bind(this);
    this.searchTypeHandler = this.searchTypeHandler.bind(this);
    this.makeSearchRequest = this.makeSearchRequest.bind(this);
    this.addToInvoiceList = this.addToInvoiceList.bind(this);
  };

  searchInputHandler = (event) => {
    if (event.target.value && event.target.value.length) {
      this.setState({ term: event.target.value?.toUpperCase() }, this.makeSearchRequest);
    } else {
      this.setState({ term: null, searchResult: null });
    }
  };
  searchTypeHandler = (type) => {
    this.setState({ type: type }, this.makeSearchRequest);
  };
  makeSearchRequest = () => {
    if (this.state.term && this.state.term.length > 5) {
      let options = {
          method: 'GET',
          redirect: 'follow'
      };
      var url = process.env?.REACT_APP_ENVIRONMENT === "local"
        ? '/api/treatment/'
        : config.API_URL + '/api/treatment/';
      if (this.state.type === "TID") {
        url += `get/${this.state.term}`;
      } else {
        url += `patient/${this.state.term}`;
      };
      fetch(url, options)
        .then(res => {
          if (res.status === 200) { return res.json(); } else { throw res.status }
        })
        .then(res => {
          if (res && res.docs && Array.isArray(res.docs)) {
            this.setState({ searchResult: res.docs });
          } else {
            this.setState({ searchResult: [res] });
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ searchResult: null });
        })
    }
  };
  addToInvoiceList = (tid) => {
    if (this.state.invoiceList.length < 3 && !this.state.invoiceList.includes(tid)) {
      this.setState({
        invoiceList: [ tid, ...this.state.invoiceList ].sort((a,b) => a > b ? 1 : -1)
      }, this.checkCompatibility);
    }
  };
  checkCompatibility = () => {
    var url = process.env.REACT_APP_ENVIRONMENT === "local"
      ? '/api/treatment/compatibility'
      : config.API_URL + '/api/treatment/compatibility';
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ list: this.state.invoiceList })
    };
    fetch(url, options)
      .then(res => {
        if (res.status === 200) { return res.json() } else { throw res.status; }
      })
      .then(res => {
        if (res && res.compatible) {
          this.setState({ compatible: true })
        } else {
          throw res.compatible;
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ compatible: false });
      })
  };
  render() {
    return (
      <div className="container">
        <div className="center-of-page">
          <input
            type="text"
            className="input-bar"
            onInput={this.searchInputHandler}
            placeholder="Search"
          />
          <br style={{userSelect: 'none'}}/>
          <table>
            <tbody>
              <tr>
                <td
                  className={this.state.type && this.state.type === "PID" ? "chosen-one" : null}
                  onClick={() => {this.searchTypeHandler("PID")}}
                >
                  Patient ID
                </td>
                <td
                  className={this.state.type && this.state.type === "TID" ? "chosen-one" : null}
                  onClick={() => {this.searchTypeHandler("TID")}}
                >
                  Treatment ID
                </td>
              </tr>
            </tbody>
          </table>
          {
            this.state.searchResult
            ?
            <div className="scrollable short-scrollable">
              {
                this.state.searchResult.map((obj, i) =>
                  <Card obj={obj} key={i+1} onClickHandler={this.addToInvoiceList} />
                )
              }
            </div>
            :
            null
          }
        </div>
        {
          this.state.invoiceList.length > 0
          ?
            <div className="meta-container right">
              <p>Invoice for <strong>only 3</strong> treatments allowed</p>
              <ul>
                {
                  this.state.invoiceList.map(tid => <li>{tid}</li>)
                }
              </ul>
              {
                this.state.compatible
                ?
                  <Link
                    to={{
                      pathname: "/invoice/payment",
                      state: {
                        invoiceList: this.state.invoiceList
                      }
                    }}
                    className="beauty"
                  >
                    Enter payment details
                  </Link>
                :
                  <span className="reject-message">All treatments for invoice must have same patient</span>
              }
            </div>
          :
          null
        }
      </div>
    );
  }
};
