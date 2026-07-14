import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const EditFaculty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        employeeId: '',
        department: '',
        designation: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await api.get(`/api/faculty/${id}`);
                const faculty = response.data;
                if (faculty) {
                    setFormData({
                        fullName: faculty.fullName || '',
                        email: faculty.email || '',
                        phoneNumber: faculty.phoneNumber || '',
                        employeeId: faculty.employeeId || '',
                        department: faculty.department || '',
                        designation: faculty.designation || '',
                        status: faculty.status || 'ACTIVE'
                    });
                }
            } catch (error) {
                toast.error('Failed to fetch faculty details');
                navigate('/faculty');
            } finally {
                setFetching(false);
            }
        };
        fetchFaculty();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/api/faculty/${id}`, formData);
            toast.success('Faculty updated successfully!');
            navigate('/faculty');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update faculty');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="d-flex">
                <Sidebar />
                <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
                    <Navbar title="Edit Faculty" />
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Edit Faculty" />
                <div className="p-4 d-flex justify-content-center">
                    <div className="dashboard-card w-100" style={{ maxWidth: '800px' }}>
                        <h4 className="mb-4 text-primary">Edit Faculty (ID: {id})</h4>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" name="fullName" className="form-control" required value={formData.fullName} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Employee ID</label>
                                    <input type="text" name="employeeId" className="form-control" required value={formData.employeeId} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Phone Number</label>
                                    <input type="text" name="phoneNumber" className="form-control" required value={formData.phoneNumber} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
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
                                    <label className="form-label">Designation</label>
                                    <input type="text" name="designation" className="form-control" required value={formData.designation} onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Status</label>
                                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                        <option value="ON_LEAVE">ON_LEAVE</option>
                                        <option value="RETIRED">RETIRED</option>
                                    </select>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/faculty')}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Faculty'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditFaculty;
