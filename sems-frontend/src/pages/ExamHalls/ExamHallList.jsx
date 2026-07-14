import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const ExamHallList = () => {
    const [examHalls, setExamHalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // Only SUPER_ADMIN can manage exam halls
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    useEffect(() => {
        fetchExamHalls();
    }, []);

    const fetchExamHalls = async () => {
        try {
            const response = await api.get('/api/exam-halls');
            setExamHalls(response.data);
        } catch (error) {
            toast.error('Failed to load exam halls');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam hall?')) {
            try {
                await api.delete(`/api/exam-halls/${id}`);
                toast.success('Exam Hall deleted successfully');
                fetchExamHalls();
            } catch (error) {
                toast.error('Failed to delete exam hall');
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Exam Halls" />
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="text-secondary">Manage Exam Halls</h4>
                        {isSuperAdmin && (
                            <Link to="/exam-halls/add" className="btn btn-primary">
                                + Add Exam Hall
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
                                            <th>Hall Number</th>
                                            <th>Building</th>
                                            <th>Floor</th>
                                            <th>Capacity</th>
                                            <th>Status</th>
                                            {isSuperAdmin && <th>Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {examHalls.length === 0 ? (
                                            <tr>
                                                <td colSpan={isSuperAdmin ? "6" : "5"} className="text-center py-4 text-muted">No exam halls found</td>
                                            </tr>
                                        ) : (
                                            examHalls.map(hall => (
                                                <tr key={hall.id}>
                                                    <td><span className="badge bg-secondary">{hall.hallNumber}</span></td>
                                                    <td className="fw-bold">{hall.building}</td>
                                                    <td>{hall.floor}</td>
                                                    <td>{hall.capacity}</td>
                                                    <td>
                                                        <span className={`badge bg-${hall.status === 'AVAILABLE' || hall.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                                                            {hall.status}
                                                        </span>
                                                    </td>
                                                    {isSuperAdmin && (
                                                        <td>
                                                            <button 
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => navigate(`/exam-halls/edit/${hall.id}`)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(hall.id)}
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

export default ExamHallList;
