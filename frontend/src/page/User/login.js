import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiAuth from '../../api/apiAuth';
import '../../assets/css/Login.css';
import { useUser } from '../../context/UserContext'; // Cập nhật đường dẫn nếu cần
import { gapi } from 'gapi-script';
import { Link } from 'react-router-dom';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Thêm state loading
    const navigate = useNavigate();
    const { login } = useUser(); // Lấy hàm login từ context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await apiAuth.loginUser({ username, password });
            // Lưu token vào localStorage
            localStorage.setItem('token', token);
            // Gọi apiAuth.getUserInfo để lấy thông tin người dùng
            const userInfo = await apiAuth.getUserInfo(token);
            // Cập nhật thông tin người dùng trong context
            login(userInfo);

            alert("Đăng nhập thành công!");
            navigate('/');
            setError('');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Thêm hàm handleLogin từ Google Sign-In
    const handleGoogleLogin = () => {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signIn({
            prompt: 'select_account'
        }).then(async (googleUser) => {
            const idToken = googleUser.getAuthResponse().id_token;

            try {
                const response = await fetch('https://localhost:7077/api/User/google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idToken })
                });

                if (response.headers.get('content-type')?.includes('application/json')) {
                    const data = await response.json();
                    if (data.success) {
                        // Cập nhật thông tin người dùng vào context và localStorage
                        login(data.user); // Cập nhật thông tin người dùng vào context
                        localStorage.setItem('user', JSON.stringify(data.user));
                        localStorage.setItem('token', data.token); // Nếu server trả về token
                        alert("Đăng nhập với Google thành công!");
                        navigate('/');
                    } else {
                        setError('Server authentication failed');
                    }
                } else {
                    const text = await response.text();
                    throw new Error(`Unexpected response format: ${text}`);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Login with Google failed.');
            }
        }).catch((error) => {
            console.log('Login Failed: ', error);
            setError('Login with Google failed.');
        });
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
                            <span className="main-heading">Signin To ThienCuongStore.vn</span>
                            <ul className="social-list mt-3">
                                <li><i className="fa fa-facebook"></i></li>
                                <li onClick={handleGoogleLogin}><i className="fa fa-google"></i></li>
                                <li><i className="fa fa-linkedin"></i></li>
                            </ul>
                            <form onSubmit={handleSubmit} className="form-data">
                                <div className="form-data">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control w-100"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="form-data">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control w-100"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="d-flex justify-content-between w-100 align-items-center">
                                    <a className="text-decoration-none forgot-text" href="#">Forgot password?</a>
                                    <Link to={'/register'} className="text-decoration-none forgot-text" href="#">
                                        <p>
                                            <span className="not-a-member-text">Not a member?</span>
                                            <span className="signup-text">Signup</span>
                                        </p>
                                    </Link>
                                </div>
                                {error && <p className="text-danger">{error}</p>}
                                <div className="signin-btn w-100 mt-2">
                                    <button type="submit" className="btn btn-danger btn-block">Signin</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
