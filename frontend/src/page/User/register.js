import React, { useState } from 'react';
import apiAuth from '../../api/apiAuth';
import '../../assets/css/Register.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Gọi API đăng ký người dùng
            await apiAuth.registerUser({
                name,
                email,
                phone,
                username,
                password
            });

            // Xử lý thành công
            alert("Đăng kí tài khoản thành công!");
            setError('');
        } catch (err) {
            // Xử lý lỗi
            setError(err || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="row g-0 mt-5 mb-5 height-100">
                <div className="col-md-6">
                    <div className="bg-white p-4 h-100 d-flex justify-content-center align-items-center">
                        <img src="https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg" alt="Sidebar Image" className="img-fluid" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="bg-white p-4 h-100">
                        <div className="p-3 d-flex justify-content-center flex-column align-items-center">
                            <span className="main-heading">Signup To ThienCuongStore.vn</span>
                            <ul className="social-list mt-3">
                                <li><i className="fa fa-facebook"></i></li>
                                <li><i className="fa fa-google"></i></li>
                                <li><i className="fa fa-linkedin"></i></li>
                            </ul>
                            <form onSubmit={handleSubmit} className="form-data">
                                <div className="form-data">
                                    <label>Họ tên:</label>
                                    <input type="text" className="form-control w-100" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="form-data">
                                    <label>Email:</label>
                                    <input type="email" className="form-control w-100" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="form-data">
                                    <label>Phone:</label>
                                    <input type="text" className="form-control w-100" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div className="form-data">
                                    <label>Username:</label>
                                    <input type="text" className="form-control w-100" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="form-data">
                                    <label>Password:</label>
                                    <input type="password" className="form-control w-100" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="form-data">
                                    <label>Nhập lại mật khẩu:</label>
                                    <input type="password" className="form-control w-100" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                                {error && <p className="text-danger">{error}</p>}
                                <div className="signin-btn w-100 mt-2">
                                    <button type="submit" className="btn btn-danger btn-block">Signup</button>
                                </div>
                                <p className="text-center mt-3">
                                    Already have an account? <a href="/login" className="text-decoration-none">Sign In</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
