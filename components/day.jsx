import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

export function WeekDay({ day }) {
  /**
   * Day component within week of a monthly calendar
   */
  if (day) {
    return (
      <div className="day">
        <span className={day.isToday() ? 'is-today' : null}>{day.format('DD')}</span>
      </div>
    );
  }
  return <div className="day disabled" />;
}
