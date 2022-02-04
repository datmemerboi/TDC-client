import { useState } from 'react';

export default function Teeth({ number, returnToParent }) {
  const [select, setSelect] = useState(false);
  const clickHandler = () => {
    setSelect(!select);
    returnToParent(number);
  };
  return (
    <div className={select ? 'teeth selected' : 'teeth'} onClick={clickHandler}>
      {number}
    </div>
  );
}
