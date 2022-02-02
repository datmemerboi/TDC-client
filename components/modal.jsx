import { useState } from 'react';

export default function Modal({ show, content, message, clickHandler }) {
  if (show) {
    if (content) {
      return (
        <div className="modal-container" onClick={clickHandler}>
          <div className="modal-message">
            <div>{content}</div>
          </div>
        </div>
      );
    } else if (message) {
      return (
        <div className="modal-container" onClick={clickHandler}>
          <div className="modal-message">
            <h3>{message}</h3>
          </div>
        </div>
      );
    } else {
      return (
        <div className="modal-container" onClick={clickHandler}>
          <div className="modal-message" />
        </div>
      );
    }
  }
  return null;
}
