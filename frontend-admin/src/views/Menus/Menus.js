import React, { useEffect, useState } from "react";
import { Box, TextField } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiMenu from "../../api/apiMenu";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../Orders/Orders.css';

const Menus = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [currentPage, setCurrentPage] = useState(1);
    const [menusPerPage] = useState(6);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await apiMenu.getAllMenus();
                setMenus(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset trang về 1 khi tìm kiếm
    };

    // Lọc danh mục dựa trên giá trị tìm kiếm
    const filteredMenus = menus.filter(menu =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Xử lý phân trang
    const indexOfLastMenu = currentPage * menusPerPage;
    const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
    const currentMenus = filteredMenus.slice(indexOfFirstMenu, indexOfLastMenu);

    // Thay đổi trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const deleteMenu = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa menu này?")) {
            try {
                await apiMenu.deleteMenu(id);
                setMenus(menus.filter(menu => menu.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <React.Fragment>
            <PageHeader title='Quản lý menu' />
            <PageBody style={{ display: "flex", justifyContent: "center" }}>
                <Box
                    flexGrow='1'
                    width='90%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                >
                    <TextField 
                        label="Tìm kiếm menu"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}
                    />
                    
                    <table className="table table-bordered" style={{ maxWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col" className="text-center">Tên menu</th>
                                <th scope="col" className="text-center">Slug</th>
                                <th scope="col" className="text-center">Link</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Trạng thái</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMenus.map(menu => (
                                <tr key={menu.id}>
                                    <th className="text-center">{menu.id}</th>
                                    <td className="text-center">{menu.name}</td>
                                    <td className="text-center">{menu.slug}</td>
                                    <td className="text-center">{menu.link}</td>
                                    <td className="text-center">{menu.status === 1 ? 'Hiển thị' : 'Ẩn'}</td>
                                    <td className="text-center">
                                        <Link to={`/menus/edit/${menu.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/3597/3597075.png"
                                                alt="Edit Icon"
                                                style={{ width: '24px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                                            />
                                        </Link>
                                        <img onClick={() => deleteMenu(menu.id)}
                                            src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png"
                                            alt="Delete Icon"
                                            style={{ width: '24px', height: 'auto', cursor: 'pointer' }} 
                                        />
                                        <Link to={`/menus/detail/${menu.id}`}>
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
                            {Array.from({ length: Math.ceil(filteredMenus.length / menusPerPage) }, (_, index) => (
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
                                    disabled={currentPage === Math.ceil(filteredMenus.length / menusPerPage)}
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

export default Menus;
