import { Fragment, useState, useEffect } from 'react';

import { InvoiceCard } from '../../components/card';
import NavBar from '../../components/navbar';
import api from '../../utils/api';

export default function InvoiceIndex() {
  const [invoiceList, setInvoiceList] = useState(null);
  const printRequest = async (invid) => {
    let { data } = await api.printInvoice(invid);
    window.open(`/view?path=${data.file}`);
  };
  useEffect(async () => {
    let { data, error } = await api.fetchAllInvoices();
    console.log(data, error);
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
              <InvoiceCard key={i} obj={obj} returnToParent={printRequest} />
            ))
          ) : (
            <h2>No invoices generated yet!</h2>
          )}
        </div>
      </div>
    </Fragment>
  );
}
