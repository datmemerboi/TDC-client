import React from 'react';
import { trFromPatList } from'../common.js';
import config from '../../config.json';

export default class PatientSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: null,
      type: "Name",
      searchResult: null
    };
    this.searchInputHandler = this.searchInputHandler.bind(this);
    this.searchTypeHandler = this.searchTypeHandler.bind(this);
    this.makeSearchRequest = this.makeSearchRequest.bind(this);
  };

  searchInputHandler = (event) => {
    if(event.target.value && event.target.value.length) {
      this.setState({ term: event.target.value }, this.makeSearchRequest);
    } else {
      this.setState({ term: null, searchResult: null });
    }
  };

  searchTypeHandler = (type) => {
    this.setState({ type: type }, this.makeSearchRequest);
  };

  makeSearchRequest = () => {
    if(this.state.term) {
      var url = process.env?.REACT_APP_ENVIRONMENT
        ? `/api/patient/search/?term=${this.state.term}&type=${this.state.type}`
        : config.API_URL + `/api/patient/search/?term=${this.state.term}&type=${this.state.type}`;
      fetch(url)
        .then(res => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw res.status
          }
        })
        .then(data => {
          if(data?.total_docs > 0) {
            this.setState({ searchResult: data.docs });
          }
        })
        .catch(err => console.error(err));
    }
  }
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
                  className={this.state.type && this.state.type === "Name" ? "chosen-one" : null}
                  onClick={() => {this.searchTypeHandler("Name")}}
                >Name</td>
                <td
                  className={this.state.type && this.state.type === "Area" ? "chosen-one" : null}
                  onClick={() => {this.searchTypeHandler("Area")}}
                >Area</td>
                <td
                  className={this.state.type && this.state.type === "Contact" ? "chosen-one" : null}
                  onClick={() => {this.searchTypeHandler("Contact")}}
                >Contact</td>
              </tr>
            </tbody>
          </table>
          </div>
          {
            this.state.searchResult
            ?
            <div className="scrollable">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Sex/Age</th>
                    <th>Contact</th>
                    <th>Area</th>
                    <th>Medical History</th>
                  </tr>
                </thead>
                <tbody>
                  {trFromPatList(this.state.searchResult)}
                </tbody>
              </table>
            </div>
            :
            null
          }
        </div>
    )
  }
};
