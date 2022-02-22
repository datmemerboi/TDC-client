export default function Modal(props) {
  if (props.show) {
    return (
      <div className="modal-container" onClick={props.handleClick}>
        <div className="modal-message">{props.children || null}</div>
      </div>
    );
  }
  return null;
}
