import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const FacultyList = () => {
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = async () => {
        try {
            const response = await api.get('/api/faculty');
            setFaculties(response.data);
        } catch (error) {
            toast.error('Failed to load faculty');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            try {
                await api.delete(`/api/faculty/${id}`);
                toast.success('Faculty deleted successfully');
                fetchFaculties();
            } catch (error) {
                toast.error('Failed to delete faculty');
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Faculty" />
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="text-secondary">Manage Faculty</h4>
                        {isSuperAdmin && (
                            <Link to="/faculty/add" className="btn btn-primary">
                                + Add Faculty
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
                                            <th>Employee No</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Department</th>
                                            <th>Designation</th>
                                            <th>Status</th>
                                            {isSuperAdmin && <th>Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {faculties.length === 0 ? (
                                            <tr>
                                                <td colSpan={isSuperAdmin ? "8" : "7"} className="text-center py-4 text-muted">No faculty members found</td>
                                            </tr>
                                        ) : (
                                            faculties.map(faculty => (
                                                <tr key={faculty.id}>
                                                    <td>{faculty.id}</td>
                                                    <td><span className="badge bg-secondary">{faculty.employeeId}</span></td>
                                                    <td className="fw-bold">{faculty.fullName}</td>
                                                    <td>{faculty.email}</td>
                                                    <td>{faculty.department}</td>
                                                    <td>{faculty.designation}</td>
                                                    <td>
                                                        <span className={`badge bg-${faculty.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                                                            {faculty.status}
                                                        </span>
                                                    </td>
                                                    {isSuperAdmin && (
                                                        <td>
                                                            <button 
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => navigate(`/faculty/edit/${faculty.id}`)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(faculty.id)}
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

export default FacultyList;
