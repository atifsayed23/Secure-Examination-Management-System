import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const ResultList = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const isStudent = user?.role === 'STUDENT';
    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'EXAM_CONTROLLER';
    
    // For publishing
    const [exams, setExams] = useState([]);
    const [publishExamId, setPublishExamId] = useState('');
    const [publishing, setPublishing] = useState(false);

    useEffect(() => {
        if (user?.role === 'FACULTY') {
            navigate('/results/add');
            return;
        }
        
        fetchData();
        if (isAdmin) fetchExams();
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (isStudent) {
                res = await api.get('/api/results/student');
            } else if (isAdmin) {
                res = await api.get('/api/results');
            }
            if (res) {
                setResults(res.data);
            }
        } catch (error) {
            toast.error("Failed to fetch results.");
        } finally {
            setLoading(false);
        }
    };

    const fetchExams = async () => {
        try {
            const res = await api.get('/api/exams');
            setExams(res.data);
        } catch (error) {}
    };

    const handlePublish = async () => {
        if (!publishExamId) {
            toast.warning("Please select an exam to publish results for.");
            return;
        }

        if (window.confirm("Are you sure you want to officially publish these results? Students will now be able to see them.")) {
            setPublishing(true);
            try {
                const res = await api.put(`/api/results/publish/${publishExamId}`);
                toast.success(res.data.message || "Results published successfully");
                fetchData(); // Refresh the list
            } catch (error) {
                toast.error("Failed to publish results.");
            } finally {
                setPublishing(false);
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Examination Results" />
                <div className="p-4">
                    
                    {/* Admin Publish Section */}
                    {isAdmin && (
                        <div className="dashboard-card mb-4 border-primary border-top border-4">
                            <h5 className="mb-3 text-secondary">Official Result Publishing</h5>
                            <div className="row g-3 align-items-end">
                                <div className="col-md-6">
                                    <label className="form-label text-muted">Select Exam to Publish Results</label>
                                    <select 
                                        className="form-select" 
                                        value={publishExamId}
                                        onChange={(e) => setPublishExamId(e.target.value)}
                                    >
                                        <option value="">-- Choose Exam --</option>
                                        {exams.map(exam => (
                                            <option key={exam.id} value={exam.id}>
                                                {exam.examCode} - {exam.examName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <button 
                                        className="btn btn-primary w-100 fw-bold"
                                        onClick={handlePublish}
                                        disabled={publishing}
                                    >
                                        {publishing ? 'Publishing...' : 'Publish Results'}
                                    </button>
                                </div>
                                <div className="col-md-3">
                                    <Link to="/results/add" className="btn btn-outline-success w-100 fw-bold">
                                        Enter Marks
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results List */}
                    <div className="dashboard-card">
                        <h5 className="mb-4 text-secondary">{isStudent ? 'My Performance Report' : 'All Student Results'}</h5>
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            {!isStudent && <th>Student Name</th>}
                                            <th>Exam</th>
                                            <th>Marks Obtained</th>
                                            <th>Percentage</th>
                                            <th>Grade</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.length === 0 ? (
                                            <tr>
                                                <td colSpan={isStudent ? "5" : "6"} className="text-center py-4 text-muted">
                                                    {isStudent ? "You have no published results yet." : "No results found."}
                                                </td>
                                            </tr>
                                        ) : (
                                            results.map(result => (
                                                <tr key={result.id}>
                                                    {!isStudent && <td className="fw-bold">{result.student}</td>}
                                                    <td className="fw-bold text-primary">{result.exam}</td>
                                                    <td>{result.marksObtained} / {result.totalMarks}</td>
                                                    <td>{result.percentage.toFixed(2)}%</td>
                                                    <td>
                                                        <span className="badge bg-secondary fs-6">{result.grade}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${result.resultStatus === 'PASS' ? 'success' : 'danger'} px-3`}>
                                                            {result.resultStatus}
                                                        </span>
                                                        {!isStudent && (
                                                            <small className="d-block text-muted mt-1" style={{fontSize: '11px'}}>
                                                                {result.published ? 'Published' : 'Draft'}
                                                            </small>
                                                        )}
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
        </div>
    );
};

export default ResultList;
