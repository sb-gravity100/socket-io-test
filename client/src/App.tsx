import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Click, Dec, Inc } from './reducer/TestCount';
import { RootState } from './store';

function App() {
   const counts = useSelector((state: RootState) => state.testReducer.counts);
   const clicks = useSelector((state: RootState) => state.testReducer.clicks);
   const dispatch = useDispatch();
   return (
      <div>
         <h1>Hello World</h1>
         <h4>
            <div>Clicks: {clicks}</div>
            <button onClick={() => dispatch(Click(0))}>Click</button>
         </h4>
         <h4>
            <div>Counts: {counts}</div>
            <button onClick={() => dispatch(Inc(1))}>Add</button>
            <button onClick={() => dispatch(Dec(1))}>Sub</button>
         </h4>
      </div>
   );
}

export default App;
