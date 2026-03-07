import { useRef } from 'react';
import Calculator from './Calculator';
import History from './History';
import './App.css';

function App() {
  const historyRef = useRef();

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>⚡ Calci</h1>
        <p className="subtitle">A simple full-stack calculator</p>
      </header>

      <main className="app-main">
        <Calculator onCalculated={() => historyRef.current?.refresh()} />
        <History ref={historyRef} />
      </main>

    </div>
  );
}

export default App;
