import Head from 'next/head';
import Link from 'next/link';
import { Fragment } from 'react';

import NavBar from '../../components/navbar';

export default function () {
  /**
   * Page for indexing all treatment pages
   *
   * @version 1.2.2
   * @route /treatment
   */
  return (
    <Fragment>
      <Head>
        <title>Treatment</title>
      </Head>
      <NavBar />
      <div className="container">
        <h2>Treatment pages</h2>
        <ul>
          <li>
            <Link href="/treatment/form">
              <a>New Treatment</a>
            </Link>
          </li>
          <li>
            <Link href="/treatment/search">
              <a>Search Treatment</a>
            </Link>
          </li>
          <li>
            <Link href="/treatment/edit">
              <a>Edit Treatment</a>
            </Link>
          </li>
        </ul>
      </div>
    </Fragment>
  );
}
