import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const AddExamHall = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        hallNumber: '',
        building: '',
        floor: '',
        capacity: '',
        status: 'AVAILABLE'
    });

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
            
            await api.post('/api/exam-halls', payload);
            toast.success('Exam Hall added successfully');
            navigate('/exam-halls');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to add exam hall');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
                <Navbar title="Add New Exam Hall" />
                <div className="p-4">
                    <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h4 className="mb-4 text-primary">Exam Hall Details</h4>
                        
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
                                        placeholder="e.g., A-101"
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
                                        placeholder="e.g., Main Block"
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
                                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                                        ) : 'Save Hall'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExamHall;
