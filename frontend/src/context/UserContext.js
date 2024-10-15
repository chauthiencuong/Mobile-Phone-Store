import React, { createContext, useState, useEffect, useContext } from 'react';
import { gapi } from 'gapi-script';  // Import gapi để sử dụng Google API

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Khi component mount, kiểm tra localStorage để khôi phục thông tin người dùng
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userInfo) => {
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
    };

    const logout = () => {
        const auth2 = gapi.auth2.getAuthInstance();  // Lấy instance của Google Auth

        // Đăng xuất từ Google nếu auth2 instance tồn tại
        if (auth2) {
            auth2.signOut().then(() => {
                console.log('User signed out from Google');
            }).catch((error) => {
                console.error('Google logout error:', error);
            });
        }

        // Xóa thông tin người dùng từ context và localStorage
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
