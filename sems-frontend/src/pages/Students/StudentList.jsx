import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/api/students');
            setStudents(response.data);
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/api/students/${id}`);
                toast.success('Student deleted successfully');
                fetchStudents();
            } catch (error) {
                toast.error('Failed to delete student');
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Students" />
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="text-secondary">Manage Students</h4>
                        {isSuperAdmin && (
                            <Link to="/students/add" className="btn btn-primary">
                                + Add Student
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
                                            <th>ID</th>
                                            <th>Enrollment No</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Department</th>
                                            <th>Semester</th>
                                            <th>Status</th>
                                            {isSuperAdmin && <th>Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length === 0 ? (
                                            <tr>
                                                <td colSpan={isSuperAdmin ? "8" : "7"} className="text-center py-4 text-muted">No students found</td>
                                            </tr>
                                        ) : (
                                            students.map(student => (
                                                <tr key={student.id}>
                                                    <td>{student.id}</td>
                                                    <td><span className="badge bg-secondary">{student.enrollmentNumber}</span></td>
                                                    <td className="fw-bold">{student.fullName}</td>
                                                    <td>{student.email}</td>
                                                    <td>{student.department}</td>
                                                    <td>Sem {student.semester}</td>
                                                    <td>
                                                        <span className={`badge bg-${student.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                                                            {student.status}
                                                        </span>
                                                    </td>
                                                    {isSuperAdmin && (
                                                        <td>
                                                            <button 
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => navigate(`/students/edit/${student.id}`)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(student.id)}
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

export default StudentList;
