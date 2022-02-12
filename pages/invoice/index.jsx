import { Fragment, useState, useEffect } from 'react';

import { InvoiceCard } from '../../components/card';
import NavBar from '../../components/navbar';
import api from '../../utils/api';

export default function InvoiceIndex() {
  const [invoiceList, setInvoiceList] = useState(null);
  const printRequest = async (invid) => {
    await api.printInvoice(invid);
    window.open(`/invoice/view?id=${invid}`);
  };

  useEffect(async () => {
    let { data } = await api.fetchAllInvoices();
    if (data) {
      setInvoiceList(data.docs);
    }
  }, []);

  return (
    <Fragment>
      <NavBar />
      <div className="container">
        <div className="scrollable">
          {invoiceList && invoiceList.length ? (
            invoiceList.map((obj, i) => (
              <InvoiceCard key={i} obj={obj} handleClick={printRequest} />
            ))
          ) : (
            <h2>No invoices generated yet!</h2>
          )}
        </div>
      </div>
    </Fragment>
  );
}
