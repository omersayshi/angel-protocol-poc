import React from 'react';
import { Wallet } from './wallet';
import { Withdraw } from './withdraw';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>         */}
        <Wallet/>
        <Withdraw/>
      </header>
    </div>
  );
}

export default App;
