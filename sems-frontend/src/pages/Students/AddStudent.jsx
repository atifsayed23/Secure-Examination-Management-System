import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const AddStudent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        enrollmentNumber: '',
        department: '',
        semester: 1,
        status: 'ACTIVE'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/students', formData);
            toast.success('Student added successfully!');
            navigate('/students');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Add Student" />
                <div className="p-4 d-flex justify-content-center">
                    <div className="dashboard-card w-100" style={{ maxWidth: '800px' }}>
                        <h4 className="mb-4 text-primary">Create New Student</h4>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" name="fullName" className="form-control" required value={formData.fullName} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Enrollment Number</label>
                                    <input type="text" name="enrollmentNumber" className="form-control" required value={formData.enrollmentNumber} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Temporary Password</label>
                                    <input type="password" name="password" className="form-control" required minLength="6" value={formData.password} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-4">
                                    <label className="form-label">Phone Number</label>
                                    <input type="text" name="phoneNumber" className="form-control" required value={formData.phoneNumber} onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Department</label>
                                    <select name="department" className="form-select" required value={formData.department} onChange={handleChange}>
                                        <option value="">Select Department</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Mechanical">Mechanical</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Semester</label>
                                    <input type="number" name="semester" min="1" max="8" className="form-control" required value={formData.semester} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/students')}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStudent;
