export default function Teeth({ number, handleClick, selected }) {
  /**
   * Component to render teeth arrangement
   *
   * @version 1.2.2
   * @prop {Number} number The teeth number to render
   * @prop {Function} handleClick Function to be called upon click
   */
  return (
    <div className={selected ? 'teeth selected' : 'teeth'} onClick={() => handleClick(number)}>
      {number}
    </div>
  );
}
