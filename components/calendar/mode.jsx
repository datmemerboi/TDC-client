import React from 'react';

export default function Mode({ current, monthObj, switchToMonthMode }) {
  return (
    <React.Fragment>
      <h3 style={{ textAlign: "center" }} onClick={switchToMonthMode}>{`${monthObj.words} ${monthObj.year}`}</h3>
    </React.Fragment>
  )
}
