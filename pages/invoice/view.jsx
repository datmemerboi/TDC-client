import { useRouter } from 'next/router';
import { Fragment } from 'react';

export default function ViewInvoice() {
  const router = useRouter();
  const { path } = router.query;
  let source = `file:///${path}`;

  return (
    <Fragment>
      <div className="container">
        <embed src={source} width={'inherit'} height={'80vh'} />
      </div>
    </Fragment>
  );
}
