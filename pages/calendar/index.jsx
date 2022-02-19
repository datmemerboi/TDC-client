import { Fragment } from 'react';
import Head from 'next/head';

import NavBar from '../../components/navbar';
import Calendar from '../../components/calendar';

export default function CalendarIndex() {
  /**
   * Page to render an interactive calendar for appointments
   *
   * @version 1.2.2
   * @route /calendar
   */
  return (
    <Fragment>
      <Head>
        <title>Calendar</title>
      </Head>
      <NavBar />
      <Calendar />
    </Fragment>
  );
}
