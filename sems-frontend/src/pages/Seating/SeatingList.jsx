import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const SeatingList = () => {
    const [arrangements, setArrangements] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    
    const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'EXAM_CONTROLLER';

    useEffect(() => {
        fetchArrangements();
    }, []);

    const fetchArrangements = async () => {
        try {
            const response = await api.get('/api/seating');
            setArrangements(response.data);
        } catch (error) {
            toast.error('Failed to load seating arrangements');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this seating arrangement?')) {
            try {
                // Backend requires SUPER_ADMIN for deletion
                await api.delete(`/api/seating/${id}`);
                toast.success('Seating arrangement deleted successfully');
                fetchArrangements();
            } catch (error) {
                toast.error('Failed to delete arrangement');
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Seating Arrangements" />
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="text-secondary">Manage Seating</h4>
                        {canManage && (
                            <Link to="/seating/add" className="btn btn-primary">
                                + Assign Seat
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
                                            <th>Student</th>
                                            <th>Exam</th>
                                            <th>Hall</th>
                                            <th>Seat Number</th>
                                            <th>Status</th>
                                            {user?.role === 'SUPER_ADMIN' && <th>Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {arrangements.length === 0 ? (
                                            <tr>
                                                <td colSpan={user?.role === 'SUPER_ADMIN' ? "6" : "5"} className="text-center py-4 text-muted">No seating arrangements found</td>
                                            </tr>
                                        ) : (
                                            arrangements.map(arr => (
                                                <tr key={arr.id}>
                                                    <td>
                                                        <div className="fw-bold">{arr.student?.fullName}</div>
                                                        <small className="text-muted">{arr.student?.enrollmentNumber}</small>
                                                    </td>
                                                    <td>
                                                        <div className="fw-bold">{arr.exam?.examName}</div>
                                                        <small className="text-muted">{arr.exam?.examCode}</small>
                                                    </td>
                                                    <td>
                                                        <div className="fw-bold">{arr.examHall?.building}</div>
                                                        <small className="text-muted">Hall: {arr.examHall?.hallNumber}</small>
                                                    </td>
                                                    <td><span className="badge bg-secondary fs-6">{arr.seatNumber}</span></td>
                                                    <td>
                                                        <span className={`badge bg-${arr.status === 'ALLOCATED' ? 'success' : 'warning'}`}>
                                                            {arr.status}
                                                        </span>
                                                    </td>
                                                    {user?.role === 'SUPER_ADMIN' && (
                                                        <td>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(arr.id)}
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

export default SeatingList;
