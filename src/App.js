import React from 'react';
import config from './config.json';

function App() {
  return (
    <div className="container">
      <div className="banner">
        <h1>The Patient Management system<br/>for</h1>
        <h1>{config.CLINIC_NAME}</h1>
        <p>Please use the nav bar above to navigate to the respective pages</p>
      </div>
    </div>
  );
}

export default App;
