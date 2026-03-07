import { useState } from 'react';
import { calculate } from './api';

const OPERATIONS = [
  { label: '+', value: 'ADD' },
  { label: '−', value: 'SUBTRACT' },
  { label: '×', value: 'MULTIPLY' },
  { label: '÷', value: 'DIVIDE' },
];

export default function Calculator({ onCalculated }) {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeOp, setActiveOp] = useState(null);

  const handleCalculate = async (operation) => {
    if (num1 === '' || num2 === '') {
      setError('Please enter both numbers');
      setResult(null);
      return;
    }

    setActiveOp(operation);
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await calculate(parseFloat(num1), parseFloat(num2), operation);
      setResult(res.data);
      if (onCalculated) onCalculated();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Something went wrong';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
      setTimeout(() => setActiveOp(null), 300);
    }
  };

  const handleClear = () => {
    setNum1('');
    setNum2('');
    setResult(null);
    setError('');
  };

  return (
    <div className="calculator-card">
      <h2 className="section-title">
        <span className="icon">🧮</span> Calculator
      </h2>

      <div className="inputs-row">
        <input
          id="num1-input"
          type="number"
          placeholder="First number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          className="num-input"
        />
        <input
          id="num2-input"
          type="number"
          placeholder="Second number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          className="num-input"
        />
      </div>

      <div className="ops-row">
        {OPERATIONS.map((op) => (
          <button
            key={op.value}
            id={`op-${op.value.toLowerCase()}`}
            className={`op-btn ${activeOp === op.value ? 'active' : ''}`}
            onClick={() => handleCalculate(op.value)}
            disabled={loading}
          >
            {op.label}
          </button>
        ))}
      </div>

      <button id="clear-btn" className="clear-btn" onClick={handleClear}>
        Clear
      </button>

      {loading && <div className="loader" />}

      {result !== null && !error && (
        <div className="result-box fade-in" id="result-display">
          <span className="result-label">Result</span>
          <span className="result-value">{result}</span>
        </div>
      )}

      {error && (
        <div className="error-box fade-in" id="error-display">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
