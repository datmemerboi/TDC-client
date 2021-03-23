import React from 'react';

export default function TreatmentIndex() {
  return (
    <div className="container">
      <h2>Treatment pages</h2>
      <ul>
          <li><a href="/treatment/form/">New Treatment</a></li>
          <li><a href="/treatment/search/">Search Treatment</a></li>
      </ul>
    </div>
  );
}
