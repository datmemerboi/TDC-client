import React from 'react';

export default function Modal({ show, content, message, onClickHandler}) {
  if (show) {
    if (content) {
      return (
        <div className="modal-container" onClick={onClickHandler}>
          <div className="modal-message">
            <div>{content}</div>
          </div>
        </div>
      );
    } else if(message) {
      return (
        <div className="modal-container" onClick={onClickHandler}>
          <div className="modal-message">
            <h3>{message}</h3>
          </div>
        </div>
      );
    } else {
      return (
        <div className="modal-container" onClick={onClickHandler}>
          <div className="modal-message" />
        </div>
      );
    }
  } else {
    return null;
  }
}
