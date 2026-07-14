import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const AddExam = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        examName: '',
        examCode: '',
        description: '',
        examDate: '',
        startTime: '',
        duration: '',
        totalMarks: '',
        status: 'SCHEDULED'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Validate numbers
            const payload = {
                ...formData,
                duration: parseInt(formData.duration, 10),
                totalMarks: parseInt(formData.totalMarks, 10)
            };
            
            await api.post('/api/exams', payload);
            toast.success('Exam added successfully');
            navigate('/exams');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to add exam');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
                <Navbar title="Add New Exam" />
                <div className="p-4">
                    <div className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h4 className="mb-4 text-primary">Exam Details</h4>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Exam Code*</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="examCode"
                                        value={formData.examCode}
                                        onChange={handleChange}
                                        required 
                                        placeholder="e.g., CS101-MID"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Exam Name*</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="examName"
                                        value={formData.examName}
                                        onChange={handleChange}
                                        required 
                                        placeholder="e.g., Data Structures Midterm"
                                    />
                                </div>
                                
                                <div className="col-md-12">
                                    <label className="form-label fw-medium">Description</label>
                                    <textarea 
                                        className="form-control" 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Optional description"
                                    ></textarea>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Exam Date*</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        name="examDate"
                                        value={formData.examDate}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Start Time*</label>
                                    <input 
                                        type="time" 
                                        className="form-control" 
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-medium">Duration (minutes)*</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        required 
                                        min="1"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-medium">Total Marks*</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        name="totalMarks"
                                        value={formData.totalMarks}
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
                                        <option value="SCHEDULED">SCHEDULED</option>
                                        <option value="ONGOING">ONGOING</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </div>

                                <div className="col-12 mt-4 d-flex justify-content-end">
                                    <button 
                                        type="button" 
                                        className="btn btn-light me-2 px-4"
                                        onClick={() => navigate('/exams')}
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
                                        ) : 'Save Exam'}
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

export default AddExam;
