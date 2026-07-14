import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import PlaceholderPage from './components/PlaceholderPage';

// Student Components
import StudentList from './pages/Students/StudentList';
import AddStudent from './pages/Students/AddStudent';
import EditStudent from './pages/Students/EditStudent';

// Faculty Components
import FacultyList from './pages/Faculty/FacultyList';
import AddFaculty from './pages/Faculty/AddFaculty';
import EditFaculty from './pages/Faculty/EditFaculty';

// Exam Components
import ExamList from './pages/Exams/ExamList';
import AddExam from './pages/Exams/AddExam';
import EditExam from './pages/Exams/EditExam';

// Exam Hall Components
import ExamHallList from './pages/ExamHalls/ExamHallList';
import AddExamHall from './pages/ExamHalls/AddExamHall';
import EditExamHall from './pages/ExamHalls/EditExamHall';

// Seating Components
import SeatingList from './pages/Seating/SeatingList';
import AddSeating from './pages/Seating/AddSeating';

// Attendance Components
import AttendanceList from './pages/Attendance/AttendanceList';
import AddAttendance from './pages/Attendance/AddAttendance';

// Question Paper Components
import QuestionPaperList from './pages/QuestionPapers/QuestionPaperList';
import QuestionPaperLogs from './pages/QuestionPapers/QuestionPaperLogs';

// Hall Ticket Components
import HallTicketViewer from './pages/HallTickets/HallTicketViewer';

// Results Components
import ResultList from './pages/Results/ResultList';
import AddResult from './pages/Results/AddResult';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/dashboard" element={
              <ProtectedRoute>
                  <Dashboard />
              </ProtectedRoute>
          } />

          {/* Students Routes */}
          <Route path="/students" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY']}>
                  <StudentList />
              </ProtectedRoute>
          } />
          <Route path="/students/add" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AddStudent />
              </ProtectedRoute>
          } />
          <Route path="/students/edit/:id" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <EditStudent />
              </ProtectedRoute>
          } />
          
          {/* Faculty Routes */}
          <Route path="/faculty" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER']}>
                  <FacultyList />
              </ProtectedRoute>
          } />
          <Route path="/faculty/add" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AddFaculty />
              </ProtectedRoute>
          } />
          <Route path="/faculty/edit/:id" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <EditFaculty />
              </ProtectedRoute>
          } />

          {/* Exams Routes */}
          <Route path="/exams" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY']}>
                  <ExamList />
              </ProtectedRoute>
          } />
          <Route path="/exams/add" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER']}>
                  <AddExam />
              </ProtectedRoute>
          } />
          <Route path="/exams/edit/:id" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER']}>
                  <EditExam />
              </ProtectedRoute>
          } />
          
          {/* Exam Halls Routes */}
          <Route path="/exam-halls" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY']}>
                  <ExamHallList />
              </ProtectedRoute>
          } />
          <Route path="/exam-halls/add" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AddExamHall />
              </ProtectedRoute>
          } />
          <Route path="/exam-halls/edit/:id" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <EditExamHall />
              </ProtectedRoute>
          } />

          {/* Seating Routes */}
          <Route path="/seating" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY']}>
                  <SeatingList />
              </ProtectedRoute>
          } />
          <Route path="/seating/add" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER']}>
                  <AddSeating />
              </ProtectedRoute>
          } />

          {/* Attendance Routes */}
          <Route path="/attendance" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY']}>
                  <AttendanceList />
              </ProtectedRoute>
          } />
          <Route path="/attendance/mark" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY']}>
                  <AddAttendance />
              </ProtectedRoute>
          } />

          {/* Question Papers Routes */}
          <Route path="/question-papers" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER', 'PAPER_SETTER']}>
                  <QuestionPaperList />
              </ProtectedRoute>
          } />
          <Route path="/question-papers/logs/:examId" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER']}>
                  <QuestionPaperLogs />
              </ProtectedRoute>
          } />

          {/* Hall Tickets Routes */}
          <Route path="/hall-tickets" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER', 'STUDENT']}>
                  <HallTicketViewer />
              </ProtectedRoute>
          } />

          {/* Results Routes */}
          <Route path="/results" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXAM_CONTROLLER', 'FACULTY', 'STUDENT']}>
                  <ResultList />
              </ProtectedRoute>
          } />
          <Route path="/results/add" element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'FACULTY']}>
                  <AddResult />
              </ProtectedRoute>
          } />

          {/* Placeholder routes for future modules */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
