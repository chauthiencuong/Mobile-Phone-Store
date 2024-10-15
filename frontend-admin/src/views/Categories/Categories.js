import React, { useEffect, useState } from "react";
import { Box, TextField } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiCategory from "../../api/apiCategory";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../Orders/Orders.css'

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');  // State để lưu giá trị tìm kiếm
    const categoriesPerPage = 6;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiCategory.getAllCategories();
                setCategories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Lọc danh mục dựa trên giá trị tìm kiếm
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastOrder = currentPage * categoriesPerPage;
    const indexOfFirstOrder = indexOfLastOrder - categoriesPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstOrder, indexOfLastOrder);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const deleteCategory = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await apiCategory.deleteCategory(id);
                setCategories(categories.filter(category => category.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <React.Fragment>
            <PageHeader title='Quản lý danh mục' />
            <PageBody style={{ display: "flex", justifyContent: "center" }}>
                <Box
                    flexGrow='1'
                    width='90%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                >
                    <TextField 
                        label="Tìm kiếm danh mục"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}
                    />
                    
                    <table className="table table-bordered" style={{ maxWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Hình Ảnh</th>
                                <th scope="col" className="text-center">Tên danh mục</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Trạng thái</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories.map(category => (
                                <tr key={category.id}>
                                    <th className="text-center">{category.id}</th>
                                    <td className="text-center">
                                        {category.imageCategory && (
                                            <img
                                                src={category.imageCategory}
                                                alt={category.name}
                                                style={{ width: 'auto', height: '60px' }} 
                                            />
                                        )}
                                    </td>
                                    <td className="text-center">{category.name}</td>
                                    <td className="text-center">{category.status === 1 ? 'Hiển thị' : 'Ẩn'}</td>
                                    <td className="text-center">
                                        <Link to={`/categories/edit/${category.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/3597/3597075.png"
                                                alt="Edit Icon"
                                                style={{ width: '24px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                                            />
                                        </Link>
                                        <img onClick={() => deleteCategory(category.id)}
                                            src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png"
                                            alt="Delete Icon"
                                            style={{ width: '24px', height: 'auto', cursor: 'pointer' }} 
                                        />
                                        <Link to={`/categories/detail/${category.id}`}>
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
                            {Array.from({ length: Math.ceil(filteredCategories.length / categoriesPerPage) }, (_, index) => (
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
                                    disabled={currentPage === Math.ceil(filteredCategories.length / categoriesPerPage)}
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

export default Categories;
