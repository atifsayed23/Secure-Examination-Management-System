import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'EXAM_CONTROLLER';

    useEffect(() => {
        if (isAdmin) {
            fetchSummary();
        } else {
            setLoading(false);
        }
    }, [isAdmin]);

    const fetchSummary = async () => {
        try {
            const response = await api.get('/api/dashboard/summary');
            setSummary(response.data);
        } catch (error) {
            toast.error('Failed to load dashboard metrics');
        } finally {
            setLoading(false);
        }
    };

    const renderAdminDashboard = () => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            );
        }

        if (!summary) return <p>Failed to load data.</p>;

        const pieData = {
            labels: ['Present', 'Absent'],
            datasets: [
                {
                    data: [summary.presentStudents, summary.absentStudents],
                    backgroundColor: ['#198754', '#dc3545'],
                }
            ]
        };

        const barData = {
            labels: ['Students', 'Faculty', 'Exams', 'Halls'],
            datasets: [
                {
                    label: 'Total Count',
                    data: [summary.totalStudents, summary.totalFaculty, summary.totalExams, summary.totalExamHalls],
                    backgroundColor: '#0d6efd',
                }
            ]
        };

        return (
            <>
                <div className="row g-4 mb-5">
                    <div className="col-md-3">
                        <div className="dashboard-card">
                            <h6 className="text-muted text-uppercase mb-2">Total Students</h6>
                            <h2 className="stat-value">{summary.totalStudents}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card">
                            <h6 className="text-muted text-uppercase mb-2">Total Faculty</h6>
                            <h2 className="stat-value">{summary.totalFaculty}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card">
                            <h6 className="text-muted text-uppercase mb-2">Total Exams</h6>
                            <h2 className="stat-value">{summary.totalExams}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card">
                            <h6 className="text-muted text-uppercase mb-2">Exam Halls</h6>
                            <h2 className="stat-value">{summary.totalExamHalls}</h2>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <div className="dashboard-card">
                            <h6 className="text-muted text-uppercase mb-2">Seating Arranged</h6>
                            <h2 className="stat-value text-success">{summary.totalSeatingArrangements}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card">
                            <h6 className="text-muted text-uppercase mb-2">Papers Uploaded</h6>
                            <h2 className="stat-value text-warning">{summary.questionPapersUploaded}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card">
                            <h6 className="text-muted text-uppercase mb-2">Results Published</h6>
                            <h2 className="stat-value text-info">{summary.publishedResults}</h2>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card">
                            <h6 className="text-muted text-uppercase mb-2">Attendance Marked</h6>
                            <h2 className="stat-value text-danger">{summary.attendanceMarked}</h2>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="dashboard-card">
                            <h5 className="mb-4">System Overview</h5>
                            <div style={{ height: '300px' }} className="d-flex justify-content-center">
                                <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="dashboard-card">
                            <h5 className="mb-4">Global Attendance</h5>
                            <div style={{ height: '300px' }} className="d-flex justify-content-center">
                                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderUserDashboard = () => {
        const quotes = [
            { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.", author: "Colin Powell" },
            { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" }
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="dashboard-card text-center p-5 border-top border-primary border-5" style={{ background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)' }}>
                            <div className="mb-4">
                                <img src="https://illustrations.popsy.co/amber/student-going-to-school.svg" alt="Welcome" style={{ height: '200px', animation: 'float 3s ease-in-out infinite' }} />
                            </div>
                            <h2 className="mb-3" style={{ fontWeight: '800', color: '#1e293b' }}>
                                Welcome to SEMS, <span className="text-primary">{user?.fullName || user?.role.replace('_', ' ')}</span>!
                            </h2>
                            <p className="text-muted fs-5 mb-5 px-md-5">
                                Your central hub for academic excellence. Navigate using the sidebar to view your hall tickets, check exam schedules, and track your results.
                            </p>
                            
                            <div className="card bg-light border-0 rounded-4 p-4 mx-md-5 shadow-sm">
                                <i className="bi bi-quote fs-1 text-primary mb-2 opacity-50"></i>
                                <h4 className="fst-italic text-dark mb-3" style={{ lineHeight: '1.6' }}>"{randomQuote.text}"</h4>
                                <p className="text-muted fw-bold mb-0">— {randomQuote.author}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
                <Navbar title="Dashboard" />
                <div className="p-4">
                    {isAdmin ? renderAdminDashboard() : renderUserDashboard()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
