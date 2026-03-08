import { useState, forwardRef, useImperativeHandle } from 'react';
import { getHistory } from './api';

function formatDate(ts) {
    if (!ts) return '—';
    let d;
    if (Array.isArray(ts)) {
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
    const [modalOpen, setModalOpen] = useState(false);

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

    const openModal = async () => {
        await fetchHistory();
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // Close modal when clicking the backdrop
    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('history-modal-backdrop')) {
            closeModal();
        }
    };

    return (
        <>
            {/* ─── Trigger button ──────────────────────────────────── */}
            <div className="history-trigger-card">
                <h2 className="section-title">
                    <span className="icon">📜</span> History
                </h2>
                <button
                    id="toggle-history-btn"
                    className="toggle-history-btn"
                    onClick={openModal}
                >
                    📋 View History
                </button>
            </div>

            {/* ─── Modal overlay ───────────────────────────────────── */}
            {modalOpen && (
                <div className="history-modal-backdrop" onClick={handleBackdropClick}>
                    <div className="history-modal fade-in">
                        <div className="history-modal-header">
                            <h2 className="section-title">
                                <span className="icon">📜</span> Calculation History
                            </h2>
                            <div className="history-modal-actions">
                                <button
                                    id="refresh-btn"
                                    className="refresh-btn"
                                    onClick={fetchHistory}
                                    disabled={loading}
                                >
                                    {loading ? '⟳' : '↻'} Refresh
                                </button>
                                <button
                                    className="close-modal-btn"
                                    onClick={closeModal}
                                    title="Close"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="history-modal-body">
                            {loading && <div className="loader" />}

                            {error && <div className="error-box">{error}</div>}

                            {!loading && !error && records.length === 0 && (
                                <p className="empty-msg">No calculations yet. Try one first!</p>
                            )}

                            {!loading && records.length > 0 && (
                                <div className="history-list">
                                    {records.map((r, i) => (
                                        <div key={i} className="history-item fade-in">
                                            <div className="history-item-top">
                                                <span className={`type-badge ${(r.type || 'SIMPLE').toLowerCase()}`}>
                                                    {r.type || 'SIMPLE'}
                                                </span>
                                                <span className="history-time">{formatDate(r.timestamp)}</span>
                                            </div>
                                            <div className="history-item-body">
                                                <span className="history-expression">{r.expression}</span>
                                                <span className="history-equals">=</span>
                                                <span className="history-result">{r.result}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

export default History;
