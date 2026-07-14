import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ title }) => {
    const { user } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3 sticky-top">
            <div className="container-fluid">
                <h4 className="mb-0 fw-bold">{title}</h4>
                <div className="d-flex align-items-center">
                    {user && (
                        <div className="me-3">
                            <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.9rem' }}>
                                Logged in as: {user.role.replace('_', ' ')}
                            </span>
                        </div>
                    )}
                    <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-light d-flex justify-content-center align-items-center me-2" style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-person-circle fs-5 text-secondary"></i>
                        </div>
                        <span className="fw-medium">{user?.email || 'User'}</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
