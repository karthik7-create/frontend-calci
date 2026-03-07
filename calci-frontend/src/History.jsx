import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getHistory } from './api';

const OP_SYMBOLS = { ADD: '+', SUBTRACT: '−', MULTIPLY: '×', DIVIDE: '÷' };

function formatDate(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const History = forwardRef(function History(_, ref) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchHistory = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getHistory();
            setRecords(res.data);
        } catch {
            setError('Could not load history');
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({ refresh: fetchHistory }));

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="history-card">
            <div className="history-header">
                <h2 className="section-title">
                    <span className="icon">📜</span> History
                </h2>
                <button
                    id="refresh-btn"
                    className="refresh-btn"
                    onClick={fetchHistory}
                    disabled={loading}
                >
                    {loading ? '⟳' : '↻'} Refresh
                </button>
            </div>

            {error && <div className="error-box">{error}</div>}

            {records.length === 0 && !loading && !error ? (
                <p className="empty-msg">No calculations yet. Try one above!</p>
            ) : (
                <div className="table-wrap">
                    <table id="history-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Expression</th>
                                <th>Result</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r, i) => (
                                <tr key={r.id ?? i} className="fade-in">
                                    <td>{i + 1}</td>
                                    <td className="expression">
                                        {r.num1} {OP_SYMBOLS[r.operation] || r.operation} {r.num2}
                                    </td>
                                    <td className="result-cell">{r.result}</td>
                                    <td className="time-cell">{formatDate(r.timestamp)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
});

export default History;
