import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const EditExamHall = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        hallNumber: '',
        building: '',
        floor: '',
        capacity: '',
        status: ''
    });

    useEffect(() => {
        fetchExamHall();
    }, [id]);

    const fetchExamHall = async () => {
        try {
            const response = await api.get(`/api/exam-halls/${id}`);
            const data = response.data;
            setFormData({
                hallNumber: data.hallNumber || '',
                building: data.building || '',
                floor: data.floor || '',
                capacity: data.capacity || '',
                status: data.status || 'AVAILABLE'
            });
        } catch (error) {
            toast.error('Failed to fetch exam hall details');
            navigate('/exam-halls');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                floor: parseInt(formData.floor, 10),
                capacity: parseInt(formData.capacity, 10)
            };
            
            await api.put(`/api/exam-halls/${id}`, payload);
            toast.success('Exam Hall updated successfully');
            navigate('/exam-halls');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to update exam hall');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
                <Navbar title="Edit Exam Hall" />
                <div className="p-4">
                    <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h4 className="mb-4 text-primary">Update Exam Hall Details</h4>
                        
                        {initialLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Hall Number*</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="hallNumber"
                                            value={formData.hallNumber}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Building*</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="building"
                                            value={formData.building}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <label className="form-label fw-medium">Floor*</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            name="floor"
                                            value={formData.floor}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-medium">Capacity*</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            name="capacity"
                                            value={formData.capacity}
                                            onChange={handleChange}
                                            required 
                                            min="1"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-medium">Status*</label>
                                        <select 
                                            className="form-select" 
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="AVAILABLE">AVAILABLE</option>
                                            <option value="MAINTENANCE">MAINTENANCE</option>
                                            <option value="OCCUPIED">OCCUPIED</option>
                                        </select>
                                    </div>

                                    <div className="col-12 mt-4 d-flex justify-content-end">
                                        <button 
                                            type="button" 
                                            className="btn btn-light me-2 px-4"
                                            onClick={() => navigate('/exam-halls')}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary px-4"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Updating...</>
                                            ) : 'Update Hall'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditExamHall;
