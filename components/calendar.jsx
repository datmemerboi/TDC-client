import dayjs from 'dayjs';

import { WeekDay } from './day';

export default function Calendar(props) {
  /**
   * Entire monthly calendar component
   */
  const now = props.day || new Date();

  let numberOfDaysInMonth = dayjs(now).daysInMonth();
  let blankDaysBeforeMonth = dayjs(now).startOf('month').day() - 1;
  let numberOfCalendarSlots = Math.ceil((numberOfDaysInMonth + blankDaysBeforeMonth) / 7) * 7;

  let monthlyDays = [];
  for (let i = 0; i < numberOfCalendarSlots; i++) {
    /**
     * Basically does: [null, null..., 1st, 2nd, 3rd......null, null]
     */
    if (i <= blankDaysBeforeMonth || i > blankDaysBeforeMonth + numberOfDaysInMonth) {
      monthlyDays.push(null);
    }
    if (i > blankDaysBeforeMonth && i <= blankDaysBeforeMonth + numberOfDaysInMonth) {
      monthlyDays.push(
        dayjs(now)
          .startOf('month')
          .add(i - blankDaysBeforeMonth - 1, 'days')
      );
    }
  }

  let weeks = [];
  for (let j = 0; j < monthlyDays.length; j += 7) {
    /** Splitting days into weeks */
    weeks.push(monthlyDays.slice(j, j + 7));
  }

  return (
    <div className="container">
      <div className="days-container">
        {weeks.map((week, i) => (
          <div className="week" key={i}>
            {week.map((day) => (
              <WeekDay day={day} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
