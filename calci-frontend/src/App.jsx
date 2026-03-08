import { useRef, useState, useEffect } from 'react';
import Calculator from './Calculator';
import History from './History';
import './App.css';

function App() {
  const historyRef = useRef();

  // Dark mode state — initialise from localStorage or system preference
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('calci-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('calci-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>⚡ Calci</h1>
        <p className="subtitle">Simple calculations &amp; expression evaluation</p>
        <button
          id="theme-toggle"
          className="theme-toggle"
          onClick={toggleTheme}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ position: 'absolute', top: 0, right: 0 }}
        >
          <span className="toggle-icon">{dark ? '☀️' : '🌙'}</span>
          {dark ? 'Light' : 'Dark'}
        </button>
      </header>

      <main className="app-main">
        <Calculator onCalculated={() => historyRef.current?.refresh()} />
        <History ref={historyRef} />
      </main>

    </div>
  );
}

export default App;
