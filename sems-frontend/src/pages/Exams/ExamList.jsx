import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const ExamList = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // EXAM_CONTROLLER and SUPER_ADMIN can manage exams
    const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'EXAM_CONTROLLER';

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await api.get('/api/exams');
            setExams(response.data);
        } catch (error) {
            toast.error('Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await api.delete(`/api/exams/${id}`);
                toast.success('Exam deleted successfully');
                fetchExams();
            } catch (error) {
                toast.error('Failed to delete exam');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'SCHEDULED': return 'primary';
            case 'ONGOING': return 'warning';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Exams" />
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="text-secondary">Manage Exams</h4>
                        {canManage && (
                            <Link to="/exams/add" className="btn btn-primary">
                                + Add Exam
                            </Link>
                        )}
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
                                            <th>Code</th>
                                            <th>Exam Name</th>
                                            <th>Date</th>
                                            <th>Start Time</th>
                                            <th>Duration (min)</th>
                                            <th>Total Marks</th>
                                            <th>Status</th>
                                            {canManage && <th>Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.length === 0 ? (
                                            <tr>
                                                <td colSpan={canManage ? "8" : "7"} className="text-center py-4 text-muted">No exams found</td>
                                            </tr>
                                        ) : (
                                            exams.map(exam => (
                                                <tr key={exam.id}>
                                                    <td><span className="badge bg-secondary">{exam.examCode}</span></td>
                                                    <td className="fw-bold">{exam.examName}</td>
                                                    <td>{exam.examDate}</td>
                                                    <td>{exam.startTime}</td>
                                                    <td>{exam.duration}</td>
                                                    <td>{exam.totalMarks}</td>
                                                    <td>
                                                        <span className={`badge bg-${getStatusBadge(exam.status)}`}>
                                                            {exam.status}
                                                        </span>
                                                    </td>
                                                    {canManage && (
                                                        <td>
                                                            <button 
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => navigate(`/exams/edit/${exam.id}`)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(exam.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    )}
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

export default ExamList;
