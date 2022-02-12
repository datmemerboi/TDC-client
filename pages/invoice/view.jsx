import { useRouter } from 'next/router';
import { Fragment } from 'react';

import NavBar from '../../components/navbar';

export default function ViewInvoice() {
  /**
   * Page to view particular invoice
   *
   * @version 1.2.2
   * @route /invoice/view
   */
  const router = useRouter();
  const { id } = router.query;
  let source = `http://localhost:8000/api/invoice/get/${id}`;

  return (
    <Fragment>
      <NavBar />
      <div className="container">
        <embed src={source} width={1250} height={670} />
      </div>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  return { props: {} };
}
