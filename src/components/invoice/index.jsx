import React, { useEffect } from 'react';
import Card from './card';
const config = require('../../config')[process.env.NODE_ENV ?? "dev"];

export default function InvoiceIndex() {
  const [invoices, setInvoices] = React.useState(null);
  const printInvoice = (invid) => {
    var url = process.env.REACT_APP_ENVIRONMENT === "local"
      ? `/api/invoice/print/${invid}`
      : config.API_URL + `/api/invoice/print/${invid}`;
    fetch(url)
      .then(res => {
        if (res.status === 201) { return res.json(); } else { throw res.status };
      })
      .then(res => {
        // console.log(res.file);
        window.open("file:///"+res.file, '_blank');
      })
      .catch(err => console.error(err));
  }
  useEffect(
    () => {
      var url = process.env.REACT_APP_ENVIRONMENT === "local"
        ? `/api/invoice/all`
        : config.API_URL + `/api/invoice/all`;
      fetch(url)
        .then(res => {
          if (res.status === 200) { return res.json(); } else { throw res.status };
        })
        .then(res => {
          console.log(res);
          setInvoices(res.docs);
        })
        .catch(err => console.error(err));
    },
    []
  );
  return (
    <div className="container">
      <div className="scrollable">
        {
          invoices && invoices.length
          ?
            invoices.map((obj,i) => <Card key={i} obj={obj} returnToParent={printInvoice} />)
          :
            <h2>No invoices generated yet!</h2>
        }
      </div>
    </div>
  )
}
