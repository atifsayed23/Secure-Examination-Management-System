import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';

const AddResult = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    
    // Dropdown Data
    const [exams, setExams] = useState([]);
    const [examHalls, setExamHalls] = useState([]);
    
    // Selected Filters
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedHallId, setSelectedHallId] = useState('');

    // Seating Data (students to grade)
    const [seatingData, setSeatingData] = useState([]);
    const [loadingSeating, setLoadingSeating] = useState(false);
    
    // Marks input state: { studentId: { marks: number, status: string } }
    const [marksState, setMarksState] = useState({});

    // We can only add results if we are SUPER_ADMIN or FACULTY.
    useEffect(() => {
        if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'FACULTY') {
            toast.error("You don't have permission to enter marks.");
            navigate('/results');
            return;
        }
        fetchDropdownData();
    }, [user]);

    const fetchDropdownData = async () => {
        try {
            const [examsRes, hallsRes] = await Promise.all([
                api.get('/api/exams'),
                api.get('/api/exam-halls')
            ]);
            setExams(examsRes.data);
            setExamHalls(hallsRes.data);
        } catch (error) {}
    };

    const fetchStudentsInHall = async () => {
        if (!selectedExamId || !selectedHallId) {
            toast.warning('Please select both an Exam and an Exam Hall first.');
            return;
        }

        setLoadingSeating(true);
        try {
            // Get all seating arrangements
            const response = await api.get('/api/seating');
            const allSeating = response.data;
            
            // Filter by selected exam and hall
            const filteredSeating = allSeating.filter(seat => 
                seat.exam.id === parseInt(selectedExamId, 10) && 
                seat.examHall.id === parseInt(selectedHallId, 10)
            );
            
            setSeatingData(filteredSeating);
            setMarksState({}); // reset marks state
            
            if (filteredSeating.length === 0) {
                toast.info("No students found allocated to this hall for this exam.");
            }
        } catch (error) {
            toast.error('Failed to fetch students.');
        } finally {
            setLoadingSeating(false);
        }
    };

    const handleMarksChange = (studentId, value) => {
        setMarksState(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], marks: value }
        }));
    };

    const submitMarks = async (studentId) => {
        const studentMarks = marksState[studentId]?.marks;
        if (studentMarks === undefined || studentMarks === '') {
            toast.warning("Please enter marks before saving.");
            return;
        }

        const payload = {
            studentId: studentId,
            examId: parseInt(selectedExamId, 10),
            marksObtained: parseInt(studentMarks, 10)
        };

        try {
            await api.post('/api/results', payload);
            toast.success("Marks saved successfully!");
            setMarksState(prev => ({
                ...prev,
                [studentId]: { ...prev[studentId], status: 'SAVED' }
            }));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Failed to save marks.");
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Enter Marks" />
                <div className="p-4">
                    
                    {/* Filters Section */}
                    <div className="dashboard-card mb-4 border-success border-top border-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0 text-secondary">Grading Roster</h5>
                            {user?.role === 'SUPER_ADMIN' && (
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/results')}>
                                    <i className="bi bi-arrow-left me-1"></i> Back to Results
                                </button>
                            )}
                        </div>
                        <div className="row g-3 align-items-end">
                            <div className="col-md-5">
                                <label className="form-label fw-medium">Select Exam</label>
                                <select 
                                    className="form-select" 
                                    value={selectedExamId}
                                    onChange={(e) => setSelectedExamId(e.target.value)}
                                >
                                    <option value="">-- Choose Exam --</option>
                                    {exams.map(exam => (
                                        <option key={exam.id} value={exam.id}>
                                            {exam.examCode} - {exam.examName} ({exam.totalMarks} Marks)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-5">
                                <label className="form-label fw-medium">Select Exam Hall</label>
                                <select 
                                    className="form-select" 
                                    value={selectedHallId}
                                    onChange={(e) => setSelectedHallId(e.target.value)}
                                >
                                    <option value="">-- Choose Exam Hall --</option>
                                    {examHalls.map(hall => (
                                        <option key={hall.id} value={hall.id}>
                                            {hall.building} - {hall.hallNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <button 
                                    className="btn btn-success w-100"
                                    onClick={fetchStudentsInHall}
                                    disabled={loadingSeating}
                                >
                                    {loadingSeating ? 'Loading...' : 'Fetch List'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Grading List Section */}
                    {seatingData.length > 0 && (
                        <div className="dashboard-card">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Student Name</th>
                                            <th>Enrollment No.</th>
                                            <th>Seat Number</th>
                                            <th>Enter Marks</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {seatingData.map(seat => {
                                            const st = seat.student;
                                            const marksData = marksState[st.id] || {};

                                            return (
                                                <tr key={seat.id}>
                                                    <td className="fw-bold">{st.fullName}</td>
                                                    <td><span className="badge bg-secondary">{st.enrollmentNumber}</span></td>
                                                    <td>{seat.seatNumber}</td>
                                                    <td style={{ width: '200px' }}>
                                                        <input 
                                                            type="number" 
                                                            className="form-control"
                                                            placeholder="e.g. 85"
                                                            value={marksData.marks || ''}
                                                            onChange={(e) => handleMarksChange(st.id, e.target.value)}
                                                            disabled={marksData.status === 'SAVED'}
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td>
                                                        {marksData.status === 'SAVED' ? (
                                                            <span className="badge bg-success px-3 py-2">
                                                                <i className="bi bi-check-circle me-1"></i> Saved
                                                            </span>
                                                        ) : (
                                                            <button 
                                                                className="btn btn-primary btn-sm px-4"
                                                                onClick={() => submitMarks(st.id)}
                                                            >
                                                                Save
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddResult;
