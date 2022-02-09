import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { PayRow } from '../../../components/payment';

export default function TreatmentPayment(props) {
  const router = useRouter();

  const [treatmentIDs, setTreatmentIDs] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [total, setTotal] = useState({ sub_total: 1, discount: 10, grand_total: 1 });

  useEffect(() => {
    let { list } = router.query;
    if (list) {
      setTreatmentIDs(list.split('-')); // treatmentIDs: [TID1, TID2, TID3]
      setPriceList(new Array(list.split('-').length).fill(1)); // priceList: [1, 1, 1]
    }
  }, []);

  useEffect(() => {
    let subTotal = priceList.reduce((acc, val) => acc + val, 0);
    let grandTotal = parseFloat(subTotal * (1 - total.discount / 100)).toFixed(2);

    setTotal({ ...total, sub_total: subTotal, grand_total: grandTotal });
  }, [priceList]);

  const updatePriceOfTreatment = (tid, value) => {
    let updatedPriceList = [...priceList]; // Copy original array
    updatedPriceList.splice(treatmentIDs.indexOf(tid), 1, value); // Replace index as of tID array
    setPriceList(updatedPriceList);
  };

  return (
    <Fragment>
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
            {treatmentIDs.map((t, i) => (
              <PayRow tid={t} returnToParent={updatePriceOfTreatment} key={i} />
            ))}
          </tbody>
        </table>
        <p>Sub total: {total.sub_total}</p>
        <p>Discount: {total.discount}</p>
        <p>Grand total: {total.grand_total}</p>
      </div>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  return { props: {} };
}
