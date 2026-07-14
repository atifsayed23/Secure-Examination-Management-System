import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await login(email, password);
            if (success) {
                toast.success('Login successful!');
                navigate('/dashboard');
            } else {
                toast.error('Invalid email or password');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to login');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: 'var(--background-color)' }}>
            <div className="card shadow-lg p-4" style={{ width: '400px', borderRadius: '12px' }}>
                <h3 className="text-center mb-4" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>SEMS Portal</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted">Email address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" style={{ backgroundColor: 'var(--primary-color)', border: 'none' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
