import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiAuth from "../../api/apiAuth"; // Đảm bảo đường dẫn đúng đến apiAuth
import { useHistory } from 'react-router-dom';

const LoginAuth = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Thêm state để lưu lỗi
    const [loading, setLoading] = useState(false); // Thêm state để xử lý trạng thái loading
    const history = useHistory(); // Khai báo useHistory

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu trạng thái loading
        setError(""); // Xóa lỗi cũ

        try {
            const token = await apiAuth.adminLogin({ username, password });
            localStorage.setItem('authToken', token);
            console.log("Login successful:", token);
            alert("Đăng nhập thành công!");
            // Điều hướng đến trang khác nếu cần
            history.push('/dashboard'); // Sử dụng history.push để điều hướng
        } catch (error) {
            console.error("Login failed:", error);
            alert("Tên đăng nhập hoặc mật khẩu của quản trị viên không hợp lệ");
            setError("Tên đăng nhập hoặc mật khẩu không đúng."); // Hiển thị lỗi nếu có
        } finally {
            setLoading(false); // Kết thúc trạng thái loading
        }
    };

    return (
        <React.Fragment>
            <PageHeader title='Login' />
            <PageBody style={{ display: "flex" }}>
                <Container component="main" maxWidth="xs">
                    <Box
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        padding={3}
                        border={1}
                        borderRadius={8}
                        boxShadow={3}
                    >
                        <Typography component="h1" variant="h5">
                            Login
                        </Typography>
                        <form onSubmit={handleLogin} style={{ width: '100%', marginTop: 8 }}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            {error && (
                                <Typography color="error" variant="body2" align="center" style={{ marginTop: 16 }}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{ marginTop: 16 }}
                                disabled={loading} // Vô hiệu hóa nút khi đang tải
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </Button>
                        </form>
                    </Box>
                </Container>
            </PageBody>
        </React.Fragment>
    );
};

export default LoginAuth;
