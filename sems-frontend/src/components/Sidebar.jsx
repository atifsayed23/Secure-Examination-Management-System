import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);

    const isStudent = user?.role === 'STUDENT';
    const isFaculty = user?.role === 'FACULTY';
    const isPaperSetter = user?.role === 'PAPER_SETTER';
    
    // Admins have full access. Faculty is granted view-only access to these core modules.
    const canViewCoreModules = user?.role === 'SUPER_ADMIN' || user?.role === 'EXAM_CONTROLLER' || user?.role === 'FACULTY';
    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'EXAM_CONTROLLER';

    return (
        <div className="sidebar p-3 d-flex flex-column" style={{ width: '250px' }}>
            <h4 className="text-center mb-4 text-white mt-3 fw-bold">SEMS</h4>
            
            <NavLink to="/dashboard" className="mb-2">Dashboard</NavLink>

            {canViewCoreModules && (
                <>
                    <NavLink to="/students" className="mb-2">Students</NavLink>
                    {isAdmin && (
                        <NavLink to="/faculty" className="mb-2">Faculty</NavLink>
                    )}
                    <NavLink to="/exams" className="mb-2">Exams</NavLink>
                    <NavLink to="/exam-halls" className="mb-2">Exam Halls</NavLink>
                    <NavLink to="/seating" className="mb-2">Seating</NavLink>
                </>
            )}

            {(isAdmin || isFaculty) && (
                <NavLink to="/attendance" className="mb-2">Attendance</NavLink>
            )}

            {(isAdmin || isPaperSetter) && (
                <NavLink to="/question-papers" className="mb-2">Question Papers</NavLink>
            )}

            {(isAdmin || isStudent) && (
                <NavLink to="/hall-tickets" className="mb-2">Hall Tickets</NavLink>
            )}
            <NavLink to="/results" className="mb-4">Results</NavLink>

            <div className="mt-auto">
                <button onClick={logout} className="btn btn-outline-light w-100">Logout</button>
            </div>
        </div>
    );
};

export default Sidebar;
