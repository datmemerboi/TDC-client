import { Fragment } from 'react';

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
      <NavBar />
      <Calendar />
    </Fragment>
  );
}
