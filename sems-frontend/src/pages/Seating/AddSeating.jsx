import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const AddSeating = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Data for dropdowns
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [examHalls, setExamHalls] = useState([]);

    const [formData, setFormData] = useState({
        studentId: '',
        examId: '',
        examHallId: '',
        seatNumber: '',
        status: 'ALLOCATED'
    });

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [studentsRes, examsRes, hallsRes] = await Promise.all([
                api.get('/api/students'),
                api.get('/api/exams'),
                api.get('/api/exam-halls')
            ]);
            
            setStudents(studentsRes.data);
            setExams(examsRes.data);
            setExamHalls(hallsRes.data);
        } catch (error) {
            toast.error('Failed to load form data. Please check your connection.');
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
                studentId: parseInt(formData.studentId, 10),
                examId: parseInt(formData.examId, 10),
                examHallId: parseInt(formData.examHallId, 10),
                seatNumber: formData.seatNumber,
                status: formData.status
            };
            
            await api.post('/api/seating', payload);
            toast.success('Seat assigned successfully');
            navigate('/seating');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to assign seat');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
                <Navbar title="Assign Seat" />
                <div className="p-4">
                    <div className="dashboard-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <h4 className="mb-4 text-primary">Seating Arrangement Details</h4>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-12">
                                    <label className="form-label fw-medium">Student*</label>
                                    <select 
                                        className="form-select" 
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a student...</option>
                                        {students.map(student => (
                                            <option key={student.id} value={student.id}>
                                                {student.enrollmentNumber} - {student.fullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="col-md-12">
                                    <label className="form-label fw-medium">Exam*</label>
                                    <select 
                                        className="form-select" 
                                        name="examId"
                                        value={formData.examId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select an exam...</option>
                                        {exams.map(exam => (
                                            <option key={exam.id} value={exam.id}>
                                                {exam.examCode} - {exam.examName} ({exam.examDate})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Exam Hall*</label>
                                    <select 
                                        className="form-select" 
                                        name="examHallId"
                                        value={formData.examHallId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select an exam hall...</option>
                                        {examHalls.map(hall => (
                                            <option key={hall.id} value={hall.id}>
                                                {hall.building} - {hall.hallNumber} (Cap: {hall.capacity})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-medium">Seat Number*</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="seatNumber"
                                        value={formData.seatNumber}
                                        onChange={handleChange}
                                        required 
                                        placeholder="e.g., S-12"
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-medium">Status*</label>
                                    <select 
                                        className="form-select" 
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="ALLOCATED">ALLOCATED</option>
                                        <option value="CHANGED">CHANGED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </div>

                                <div className="col-12 mt-4 d-flex justify-content-end">
                                    <button 
                                        type="button" 
                                        className="btn btn-light me-2 px-4"
                                        onClick={() => navigate('/seating')}
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
                                        ) : 'Assign Seat'}
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

export default AddSeating;
