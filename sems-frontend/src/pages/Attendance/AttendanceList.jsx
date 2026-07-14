import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const AttendanceList = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    
    // Only SUPER_ADMIN can delete records. All roles can view.
    const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'EXAM_CONTROLLER' || user?.role === 'FACULTY';

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const response = await api.get('/api/attendance');
            setAttendanceRecords(response.data);
        } catch (error) {
            toast.error('Failed to load attendance records');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this attendance record?')) {
            try {
                await api.delete(`/api/attendance/${id}`);
                toast.success('Attendance record deleted successfully');
                fetchAttendance();
            } catch (error) {
                toast.error('Failed to delete attendance record');
            }
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
                <Navbar title="Attendance Management" />
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="text-secondary">Attendance Records</h4>
                        {canManage && (
                            <Link to="/attendance/mark" className="btn btn-primary">
                                + Mark Attendance
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
                                            <th>Time Logged</th>
                                            <th>Status</th>
                                            {user?.role === 'SUPER_ADMIN' && <th>Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceRecords.length === 0 ? (
                                            <tr>
                                                <td colSpan={user?.role === 'SUPER_ADMIN' ? "6" : "5"} className="text-center py-4 text-muted">No attendance records found</td>
                                            </tr>
                                        ) : (
                                            attendanceRecords.map(record => (
                                                <tr key={record.id}>
                                                    <td>
                                                        <div className="fw-bold">{record.student?.fullName}</div>
                                                        <small className="text-muted">{record.student?.enrollmentNumber}</small>
                                                    </td>
                                                    <td>
                                                        <div className="fw-bold">{record.exam?.examName}</div>
                                                        <small className="text-muted">{record.exam?.examCode}</small>
                                                    </td>
                                                    <td>
                                                        <div className="fw-bold">{record.examHall?.building}</div>
                                                        <small className="text-muted">Hall: {record.examHall?.hallNumber}</small>
                                                    </td>
                                                    <td>{formatDate(record.attendanceTime)}</td>
                                                    <td>
                                                        <span className={`badge bg-${record.attendanceStatus === 'PRESENT' ? 'success' : record.attendanceStatus === 'ABSENT' ? 'danger' : 'warning'}`}>
                                                            {record.attendanceStatus}
                                                        </span>
                                                    </td>
                                                    {user?.role === 'SUPER_ADMIN' && (
                                                        <td>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(record.id)}
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

export default AttendanceList;
