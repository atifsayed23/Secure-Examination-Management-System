import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const HallTicketViewer = () => {
    const { user } = useContext(AuthContext);
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    
    const [hallTicket, setHallTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'EXAM_CONTROLLER';

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const promises = [api.get('/api/exams')];
            
            if (isAdmin) {
                promises.push(api.get('/api/students'));
            } else if (user?.role === 'STUDENT') {
                promises.push(api.get('/api/students/me'));
            }

            const results = await Promise.all(promises);
            setExams(results[0].data);
            
            if (isAdmin) {
                setStudents(results[1].data);
            } else if (user?.role === 'STUDENT') {
                setSelectedStudentId(results[1].data.id);
            }
        } catch (error) {
            toast.error("Failed to load initial data.");
        }
    };

    const handleView = async () => {
        if (!selectedExamId || !selectedStudentId) {
            toast.warning("Please select both a student and an exam.");
            return;
        }

        setLoading(true);
        setHallTicket(null);
        try {
            const response = await api.get(`/api/hall-tickets/student/${selectedStudentId}/exam/${selectedExamId}`);
            setHallTicket(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("No seating arrangement/hall ticket found for this student and exam.");
            } else {
                toast.error("Failed to fetch hall ticket.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!selectedExamId || !selectedStudentId) return;

        try {
            const response = await api.get(`/api/hall-tickets/student/${selectedStudentId}/exam/${selectedExamId}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `HallTicket_${selectedStudentId}_${selectedExamId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
            toast.success("Hall Ticket downloaded successfully!");
        } catch (error) {
            toast.error("Failed to download Hall Ticket.");
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Hall Tickets" />
                <div className="p-4">
                    
                    <div className="dashboard-card mb-4">
                        <h5 className="mb-3 text-secondary">{isAdmin ? "Generate / View Hall Ticket" : "My Hall Tickets"}</h5>
                        <div className="row g-3 align-items-end">
                            {isAdmin && (
                                <div className="col-md-5">
                                    <label className="form-label fw-medium">Select Student</label>
                                    <select 
                                        className="form-select" 
                                        value={selectedStudentId}
                                        onChange={(e) => setSelectedStudentId(e.target.value)}
                                    >
                                        <option value="">-- Choose Student --</option>
                                        {students.map(student => (
                                            <option key={student.id} value={student.id}>
                                                {student.enrollmentNumber} - {student.fullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className={isAdmin ? "col-md-5" : "col-md-10"}>
                                <label className="form-label fw-medium">Select Exam</label>
                                <select 
                                    className="form-select" 
                                    value={selectedExamId}
                                    onChange={(e) => setSelectedExamId(e.target.value)}
                                >
                                    <option value="">-- Choose Exam --</option>
                                    {exams.map(exam => (
                                        <option key={exam.id} value={exam.id}>
                                            {exam.examCode} - {exam.examName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <button 
                                    className="btn btn-primary w-100"
                                    onClick={handleView}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'View Ticket'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {hallTicket && (
                        <div className="dashboard-card">
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div>
                                    <h4 className="text-primary mb-0">Examination Hall Ticket</h4>
                                    <small className="text-muted">Secure Examination Management System</small>
                                </div>
                                <button className="btn btn-success" onClick={handleDownload}>
                                    <i className="bi bi-download me-2"></i> Download PDF
                                </button>
                            </div>

                            <div className="row g-4">
                                <div className="col-md-6 border-end">
                                    <h5 className="text-secondary mb-3">Student Details</h5>
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <th className="text-muted" width="150">Name</th>
                                                <td className="fw-bold">{hallTicket.studentName}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Enrollment No</th>
                                                <td>{hallTicket.enrollmentNumber}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Department</th>
                                                <td>{hallTicket.department}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Semester</th>
                                                <td>{hallTicket.semester}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="col-md-6">
                                    <h5 className="text-secondary mb-3">Exam Details</h5>
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <th className="text-muted" width="150">Exam Name</th>
                                                <td className="fw-bold">{hallTicket.examName}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Date & Time</th>
                                                <td>{new Date(hallTicket.examDate).toLocaleDateString()} at {hallTicket.examTime}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Exam Hall</th>
                                                <td>{hallTicket.examHallBuilding} - Hall {hallTicket.examHallNumber}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-muted">Seat Number</th>
                                                <td><span className="badge bg-primary fs-6">{hallTicket.seatNumber}</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-3 border-top text-center text-muted">
                                <small>Please carry a valid student ID card along with this hall ticket to the examination hall.</small>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HallTicketViewer;
