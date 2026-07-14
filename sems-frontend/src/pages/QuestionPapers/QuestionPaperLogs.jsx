import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const QuestionPaperLogs = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'EXAM_CONTROLLER') {
            navigate('/dashboard');
            return;
        }
        fetchLogs();
    }, [examId]);

    const fetchLogs = async () => {
        try {
            const response = await api.get(`/api/question-papers/${examId}/audit-logs`);
            setLogs(response.data);
        } catch (error) {
            toast.error('Failed to load audit logs for this exam');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Audit Logs" />
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="text-secondary">Question Paper Access Logs</h4>
                        <button className="btn btn-outline-secondary" onClick={() => navigate('/question-papers')}>
                            <i className="bi bi-arrow-left me-1"></i> Back to Question Papers
                        </button>
                    </div>

                    <div className="dashboard-card">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>User</th>
                                            <th>Action</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-muted">No audit logs found for this exam.</td>
                                            </tr>
                                        ) : (
                                            logs.map(log => (
                                                <tr key={log.id}>
                                                    <td className="text-muted">{formatDate(log.timestamp)}</td>
                                                    <td className="fw-bold">{log.userName}</td>
                                                    <td>
                                                        <span className={`badge bg-${log.action === 'UPLOAD' ? 'primary' : log.action === 'DOWNLOAD' ? 'success' : 'danger'}`}>
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${log.status === 'SUCCESS' ? 'success' : 'danger'}`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionPaperLogs;
