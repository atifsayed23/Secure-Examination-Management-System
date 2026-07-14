import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
                <Navbar title={title} />
                <div className="p-4 d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="text-center">
                        <h2 className="text-muted">{title} Module</h2>
                        <p className="text-secondary">This module is under construction.</p>
                        <div className="spinner-grow text-primary mt-3" role="status"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderPage;
