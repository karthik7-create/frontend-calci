import { useState } from 'react';
import { calculate, evaluateExpression } from './api';

const OPERATIONS = [
  { label: '+', value: 'ADD' },
  { label: '−', value: 'SUBTRACT' },
  { label: '×', value: 'MULTIPLY' },
  { label: '÷', value: 'DIVIDE' },
];

export default function Calculator({ onCalculated }) {
  // ─── Simple calculator state ──────────────────────────────────────
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeOp, setActiveOp] = useState(null);

  // ─── Expression evaluator state ───────────────────────────────────
  const [expression, setExpression] = useState('');
  const [exprResult, setExprResult] = useState(null);
  const [exprError, setExprError] = useState('');
  const [exprLoading, setExprLoading] = useState(false);

  // ─── Active tab ───────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('simple');

  // ─── Simple calculation handler ───────────────────────────────────
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
      const data = err.response?.data;
      const msg = data?.message || data?.error || (typeof data === 'string' ? data : 'Something went wrong');
      setError(msg);
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

  // ─── Expression evaluation handler ────────────────────────────────
  const handleEvaluate = async () => {
    if (!expression.trim()) {
      setExprError('Please enter an expression');
      setExprResult(null);
      return;
    }

    setExprLoading(true);
    setExprError('');
    setExprResult(null);

    try {
      const res = await evaluateExpression(expression.trim());
      setExprResult(res.data);
      if (onCalculated) onCalculated();
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.message || data?.error || (typeof data === 'string' ? data : 'Failed to evaluate expression');
      setExprError(msg);
    } finally {
      setExprLoading(false);
    }
  };

  const handleExprClear = () => {
    setExpression('');
    setExprResult(null);
    setExprError('');
  };

  const handleExprKeyDown = (e) => {
    if (e.key === 'Enter') handleEvaluate();
  };

  return (
    <div className="calculator-card">
      {/* ─── Tab switcher ─────────────────────────────────────────── */}
      <div className="tab-switcher">
        <button
          id="tab-simple"
          className={`tab-btn ${activeTab === 'simple' ? 'active' : ''}`}
          onClick={() => setActiveTab('simple')}
        >
          🧮 Simple
        </button>
        <button
          id="tab-expression"
          className={`tab-btn ${activeTab === 'expression' ? 'active' : ''}`}
          onClick={() => setActiveTab('expression')}
        >
          📐 Expression
        </button>
      </div>

      {/* ─── Simple calculator panel ──────────────────────────────── */}
      {activeTab === 'simple' && (
        <div className="tab-panel fade-in">
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
      )}

      {/* ─── Expression evaluator panel ───────────────────────────── */}
      {activeTab === 'expression' && (
        <div className="tab-panel fade-in">
          <p className="expr-hint">
            Enter a math expression like <code>(4+1)-7</code> or <code>5*(3+2)</code>
          </p>

          <input
            id="expression-input"
            type="text"
            placeholder="e.g. (4+1)-7"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={handleExprKeyDown}
            className="num-input expression-input"
          />

          <div className="expr-actions">
            <button
              id="evaluate-btn"
              className="op-btn evaluate-btn"
              onClick={handleEvaluate}
              disabled={exprLoading}
            >
              {exprLoading ? '⟳' : '='} Evaluate
            </button>
            <button className="clear-btn" onClick={handleExprClear}>
              Clear
            </button>
          </div>

          {exprLoading && <div className="loader" />}

          {exprResult && !exprError && (
            <div className="result-box fade-in" id="expr-result-display">
              <div className="expr-result-info">
                <span className="result-label">Expression</span>
                <span className="expr-text">{exprResult.expression}</span>
              </div>
              <span className="result-value">{exprResult.result}</span>
            </div>
          )}

          {exprError && (
            <div className="error-box fade-in" id="expr-error-display">
              ⚠️ {exprError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
