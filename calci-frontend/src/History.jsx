import { useState, forwardRef, useImperativeHandle } from 'react';
import { getHistory } from './api';

function formatDate(ts) {
    if (!ts) return '—';
    let d;
    if (Array.isArray(ts)) {
        // Java LocalDateTime comes as [year, month, day, hour, minute, second, nano]
        const [y, mo, day, h = 0, m = 0, s = 0] = ts;
        d = new Date(y, mo - 1, day, h, m, s);
    } else {
        d = new Date(ts);
    }
    if (isNaN(d.getTime())) return '—';
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
    const [visible, setVisible] = useState(false);

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

    const toggleHistory = async () => {
        if (!visible) {
            await fetchHistory();
        }
        setVisible((prev) => !prev);
    };

    return (
        <div className="history-card">
            <div className="history-header">
                <h2 className="section-title">
                    <span className="icon">📜</span> History
                </h2>
                <div className="history-actions">
                    <button
                        id="toggle-history-btn"
                        className="toggle-history-btn"
                        onClick={toggleHistory}
                    >
                        {visible ? '▲ Hide' : '▼ Show'} History
                    </button>
                    {visible && (
                        <button
                            id="refresh-btn"
                            className="refresh-btn"
                            onClick={fetchHistory}
                            disabled={loading}
                        >
                            {loading ? '⟳' : '↻'} Refresh
                        </button>
                    )}
                </div>
            </div>

            {visible && (
                <div className="history-body fade-in">
                    {error && <div className="error-box">{error}</div>}

                    {records.length === 0 && !loading && !error ? (
                        <p className="empty-msg">No calculations yet. Try one above!</p>
                    ) : (
                        <div className="table-wrap">
                            <table id="history-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Type</th>
                                        <th>Expression</th>
                                        <th>Result</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((r, i) => (
                                        <tr key={i} className="fade-in">
                                            <td>{i + 1}</td>
                                            <td>
                                                <span className={`type-badge ${(r.type || 'SIMPLE').toLowerCase()}`}>
                                                    {r.type || 'SIMPLE'}
                                                </span>
                                            </td>
                                            <td className="expression">{r.expression}</td>
                                            <td className="result-cell">{r.result}</td>
                                            <td className="time-cell">{formatDate(r.timestamp)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

export default History;
