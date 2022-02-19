import Head from 'next/head';
import { Fragment, useState, useEffect } from 'react';

import api from '../../utils/api';
import NavBar from '../../components/navbar';
import { InvoiceCard } from '../../components/card';

export default function InvoiceIndex() {
  /**
   * Page to render list of invoices generated
   *
   * @version 1.2.2
   * @route /invoice
   */
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
      <Head>
        <title>Invoice</title>
      </Head>
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
