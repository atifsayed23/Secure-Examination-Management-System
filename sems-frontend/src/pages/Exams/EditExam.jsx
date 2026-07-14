import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const EditExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        examName: '',
        examCode: '',
        description: '',
        examDate: '',
        startTime: '',
        duration: '',
        totalMarks: '',
        status: ''
    });

    useEffect(() => {
        fetchExam();
    }, [id]);

    const fetchExam = async () => {
        try {
            const response = await api.get(`/api/exams/${id}`);
            const data = response.data;
            setFormData({
                examName: data.examName || '',
                examCode: data.examCode || '',
                description: data.description || '',
                examDate: data.examDate || '',
                startTime: data.startTime || '',
                duration: data.duration || '',
                totalMarks: data.totalMarks || '',
                status: data.status || 'SCHEDULED'
            });
        } catch (error) {
            toast.error('Failed to fetch exam details');
            navigate('/exams');
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
                duration: parseInt(formData.duration, 10),
                totalMarks: parseInt(formData.totalMarks, 10)
            };
            
            await api.put(`/api/exams/${id}`, payload);
            toast.success('Exam updated successfully');
            navigate('/exams');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to update exam');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
                <Navbar title="Edit Exam" />
                <div className="p-4">
                    <div className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h4 className="mb-4 text-primary">Update Exam Details</h4>
                        
                        {initialLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        ) : (
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
                                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Updating...</>
                                            ) : 'Update Exam'}
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

export default EditExam;
