import Head from 'next/head';
import Link from 'next/link';
import { Fragment } from 'react';

import NavBar from '../../components/navbar';

export default function () {
  /**
   * Page for indexing all patient pages
   *
   * @version 1.2.2
   * @route /patient
   */
  return (
    <Fragment>
      <Head>
        <title>Patient</title>
      </Head>
      <NavBar />
      <div className="container">
        <h2>Patient pages</h2>
        <ul>
          <li>
            <Link href="/patient/form">
              <a>New Patient</a>
            </Link>
          </li>
          <li>
            <Link href="/patient/table">
              <a>All Patients</a>
            </Link>
          </li>
          <li>
            <Link href="/patient/search">
              <a>Search Patient</a>
            </Link>
          </li>
          <li>
            <Link href="/patient/edit">
              <a>Edit Patient</a>
            </Link>
          </li>
        </ul>
      </div>
    </Fragment>
  );
}
