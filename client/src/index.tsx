import React from 'react';
import ReactDOM from 'react-dom';

function App() {
   return <div className="app">Hello World</div>;
}

ReactDOM.render(
   <React.StrictMode>
      <App></App>
   </React.StrictMode>,
   document.querySelector('#root')
);
