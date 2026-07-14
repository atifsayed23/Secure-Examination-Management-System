import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const QuestionPaperList = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const canUpload = user?.role === 'SUPER_ADMIN' || user?.role === 'PAPER_SETTER';
    const canDownload = user?.role === 'SUPER_ADMIN' || user?.role === 'EXAM_CONTROLLER';

    const fileInputRef = useRef(null);
    const [selectedExamId, setSelectedExamId] = useState(null);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await api.get('/api/exams');
            setExams(response.data);
        } catch (error) {
            toast.error('Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (examId, examName) => {
        try {
            const response = await api.get(`/api/question-papers/download/${examId}`, {
                responseType: 'blob'
            });
            
            // Create a temporary link to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `QuestionPaper_${examName.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
            toast.success("Question paper downloaded successfully!");
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error("Access denied: You can only download this during the exam time.");
            } else if (error.response && error.response.status === 400) {
                toast.error("No question paper has been uploaded for this exam yet.");
            } else {
                toast.error("Failed to download question paper.");
            }
        }
    };

    const triggerUpload = (examId) => {
        setSelectedExamId(examId);
        fileInputRef.current.click();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading("Uploading question paper...");

        try {
            await api.post(`/api/question-papers/upload/${selectedExamId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.update(toastId, { render: "Upload successful!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            toast.update(toastId, { render: error.response?.data || "Upload failed", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            // Reset input
            e.target.value = null;
            setSelectedExamId(null);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Secure Question Papers" />
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="text-secondary">Question Paper Management</h4>
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
                                            <th>Exam Name</th>
                                            <th>Code</th>
                                            <th>Date & Time</th>
                                            <th>Duration</th>
                                            <th>Status</th>
                                            <th>Secure Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">No exams available</td>
                                            </tr>
                                        ) : (
                                            exams.map(exam => (
                                                <tr key={exam.id}>
                                                    <td className="fw-bold">{exam.examName}</td>
                                                    <td><span className="badge bg-secondary">{exam.examCode}</span></td>
                                                    <td>
                                                        {new Date(exam.examDate).toLocaleDateString()} <br/>
                                                        <small className="text-muted">{exam.startTime}</small>
                                                    </td>
                                                    <td>{exam.duration} mins</td>
                                                    <td>
                                                        <span className={`badge bg-${exam.status === 'SCHEDULED' ? 'primary' : exam.status === 'ONGOING' ? 'warning' : 'success'}`}>
                                                            {exam.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            {canUpload && (
                                                                <button 
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => triggerUpload(exam.id)}
                                                                >
                                                                    <i className="bi bi-upload me-1"></i> Upload
                                                                </button>
                                                            )}
                                                            
                                                            {canDownload && (
                                                                <>
                                                                    <button 
                                                                        className="btn btn-sm btn-success"
                                                                        onClick={() => handleDownload(exam.id, exam.examName)}
                                                                    >
                                                                        <i className="bi bi-download me-1"></i> Download
                                                                    </button>
                                                                    <button 
                                                                        className="btn btn-sm btn-outline-info"
                                                                        onClick={() => navigate(`/question-papers/logs/${exam.id}`)}
                                                                    >
                                                                        <i className="bi bi-journal-text me-1"></i> Logs
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
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

            {/* Hidden File Input for Upload */}
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
            />
        </div>
    );
};

export default QuestionPaperList;
