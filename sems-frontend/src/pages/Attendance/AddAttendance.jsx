import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const AddAttendance = () => {
    const navigate = useNavigate();
    
    // Dropdown Data
    const [exams, setExams] = useState([]);
    const [examHalls, setExamHalls] = useState([]);
    
    // Selected Filters
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedHallId, setSelectedHallId] = useState('');

    // Seating Data (which gives us the students in the hall)
    const [seatingData, setSeatingData] = useState([]);
    const [loadingSeating, setLoadingSeating] = useState(false);
    
    // Track marked attendance to disable buttons or show status
    const [markedStudents, setMarkedStudents] = useState({});

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [examsRes, hallsRes] = await Promise.all([
                api.get('/api/exams'),
                api.get('/api/exam-halls')
            ]);
            setExams(examsRes.data);
            setExamHalls(hallsRes.data);
        } catch (error) {
            toast.error('Failed to load exams and halls.');
        }
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
            setMarkedStudents({}); // reset marked statuses
            
            if (filteredSeating.length === 0) {
                toast.info("No students found allocated to this hall for this exam.");
            }
        } catch (error) {
            toast.error('Failed to fetch seating arrangements.');
        } finally {
            setLoadingSeating(false);
        }
    };

    const markAttendance = async (studentId, status) => {
        const payload = {
            studentId: studentId,
            examId: parseInt(selectedExamId, 10),
            examHallId: parseInt(selectedHallId, 10),
            attendanceStatus: status
        };

        try {
            await api.post('/api/attendance', payload);
            toast.success(`Marked as ${status}`);
            
            // Update local state to show it's marked
            setMarkedStudents(prev => ({
                ...prev,
                [studentId]: status
            }));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error(`Failed to mark attendance for student ID: ${studentId}`);
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Mark Quick Attendance" />
                <div className="p-4">
                    
                    {/* Filters Section */}
                    <div className="dashboard-card mb-4">
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
                                            {exam.examCode} - {exam.examName} ({exam.examDate})
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
                                    className="btn btn-primary w-100"
                                    onClick={fetchStudentsInHall}
                                    disabled={loadingSeating}
                                >
                                    {loadingSeating ? 'Loading...' : 'Fetch List'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Students List Section */}
                    {seatingData.length > 0 && (
                        <div className="dashboard-card">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="text-secondary mb-0">Students in Hall</h5>
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/attendance')}>
                                    View All Records
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle text-center">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="text-start">Student Name</th>
                                            <th>Enrollment No.</th>
                                            <th>Seat Number</th>
                                            <th>Mark Attendance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {seatingData.map(seat => {
                                            const st = seat.student;
                                            const status = markedStudents[st.id];

                                            return (
                                                <tr key={seat.id}>
                                                    <td className="text-start fw-bold">{st.fullName}</td>
                                                    <td><span className="badge bg-secondary">{st.enrollmentNumber}</span></td>
                                                    <td>{seat.seatNumber}</td>
                                                    <td>
                                                        {status ? (
                                                            <span className={`badge bg-${status === 'PRESENT' ? 'success' : 'danger'} px-3 py-2 fs-6`}>
                                                                {status}
                                                            </span>
                                                        ) : (
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <button 
                                                                    className="btn btn-success fw-bold px-4 py-1 rounded-pill shadow-sm"
                                                                    onClick={() => markAttendance(st.id, 'PRESENT')}
                                                                >
                                                                    P
                                                                </button>
                                                                <button 
                                                                    className="btn btn-danger fw-bold px-4 py-1 rounded-pill shadow-sm"
                                                                    onClick={() => markAttendance(st.id, 'ABSENT')}
                                                                >
                                                                    A
                                                                </button>
                                                            </div>
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

export default AddAttendance;
