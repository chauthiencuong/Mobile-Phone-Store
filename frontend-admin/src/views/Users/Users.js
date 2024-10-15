import React, { useEffect, useState } from "react";
import { Box, TextField } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../Orders/Orders.css';
import apiAuth from "../../api/apiAuth";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');  // State để lưu giá trị tìm kiếm
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(6); // Số lượng user trên mỗi trang

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await apiAuth.getAllUsers();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset trang về 1 khi tìm kiếm
    };

    // Lọc danh mục dựa trên giá trị tìm kiếm
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Xử lý phân trang
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Thay đổi trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const deleteUser = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
            try {
                await apiAuth.deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <React.Fragment>
            <PageHeader title='Quản lý người dùng' />
            <PageBody style={{ display: "flex", justifyContent: "center" }}>
                <Box
                    flexGrow='1'
                    width='90%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                >
                    <TextField 
                        label="Tìm kiếm user"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}
                    />
                    
                    <table className="table table-bordered" style={{ maxWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th scope="col" className="text-center">ID</th>
                                <th scope="col" className="text-center">Tên</th>
                                <th scope="col" className="text-center">Email</th>
                                <th scope="col" className="text-center">Phone</th>
                                <th scope="col" className="text-center">Role</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.id}>
                                    <th className="text-center">{user.id}</th>
                                    <td className="text-center">{user.name}</td>
                                    <td className="text-center">{user.email}</td>
                                    <td className="text-center">{user.phone}</td>
                                    <td className="text-center">{user.role}</td>
                                    <td className="text-center">
                                        <Link to={`/users/edit/${user.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/3597/3597075.png"
                                                alt="Edit Icon"
                                                style={{ width: '24px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                                            />
                                        </Link>
                                        <img onClick={() => deleteUser(user.id)}
                                            src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png"
                                            alt="Delete Icon"
                                            style={{ width: '24px', height: 'auto', cursor: 'pointer' }} 
                                        />
                                        <Link to={`/users/detail/${user.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/1265/1265907.png"
                                                alt="Icon 3"
                                                style={{ width: '24px', height: 'auto', marginLeft: '8px' }} 
                                            />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Phân trang */}
                    <nav>
                        <ul className="pagination flex-wrap d-flex justify-content-center">
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <FontAwesomeIcon icon={faAngleLeft} style={{ cursor: 'pointer' }} />
                                </button>
                            </li>
                            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
                                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button onClick={() => paginate(index + 1)} className="page-link">
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className="page-item">
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                                >
                                    <FontAwesomeIcon icon={faAngleRight} style={{ cursor: 'pointer' }} />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </Box>
            </PageBody>
        </React.Fragment>
    );
};

export default Users;
