import React from 'react';
import ReactDOM from 'react-dom';

import HelloButton from './HelloButton.jsx';

export default function(domContainer) {
  ReactDOM.render(React.createElement(HelloButton), domContainer);
}
