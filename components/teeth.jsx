import { useState } from 'react';

export default function Teeth({ number, returnToParent }) {
  /**
   * Component to render teeth arrangement
   *
   * @version 1.2.2
   * @prop {Number} number The teeth number to render
   * @prop {Function} returnToParent Function to be called upon state change
   */
  const [select, setSelect] = useState(false);
  const handleClick = () => {
    setSelect(!select);
    returnToParent(number);
  };
  return (
    <div className={select ? 'teeth selected' : 'teeth'} onClick={handleClick}>
      {number}
    </div>
  );
}
