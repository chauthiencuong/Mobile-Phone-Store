import React, { useEffect, useState } from "react";
import { Box, TextField } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiBrand from "../../api/apiBrand";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../Orders/Orders.css';

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');  // State để lưu giá trị tìm kiếm
    const brandsPerPage = 6;

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await apiBrand.getAllBrands();
                setBrands(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset current page when search term changes
    };

    // Lọc danh sách thương hiệu dựa trên giá trị tìm kiếm
    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Phân trang
    const indexOfLastBrand = currentPage * brandsPerPage;
    const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
    const currentBrands = filteredBrands.slice(indexOfFirstBrand, indexOfLastBrand);

    // Chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const deleteBrand = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
            try {
                await apiBrand.deleteBrand(id);
                setBrands(brands.filter(brand => brand.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <React.Fragment>
            <PageHeader title='Quản lý thương hiệu' />
            <PageBody style={{ display: "flex", justifyContent: "center" }}>
                <Box
                    flexGrow='1'
                    width='90%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                >
                    <TextField 
                        label="Tìm kiếm thương hiệu"
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
                                <th scope="col" className="text-center">Tên thương hiệu</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Trạng thái</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBrands.map(brand => (
                                <tr key={brand.id}>
                                    <th className="text-center">{brand.id}</th>
                                    <td className="text-center">
                                        {brand.imageBrand && (
                                            <img
                                                src={brand.imageBrand}
                                                alt={brand.name}
                                                style={{ width: '150px', height: '40px' }} 
                                            />
                                        )}
                                    </td>
                                    <td className="text-center">{brand.name}</td>
                                    <td className="text-center">{brand.status === 1 ? 'Hiển thị' : 'Ẩn'}</td>
                                    <td className="text-center">
                                        <Link to={`/brands/edit/${brand.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/3597/3597075.png"
                                                alt="Edit Icon"
                                                style={{ width: '24px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                                            />
                                        </Link>
                                        <img onClick={() => deleteBrand(brand.id)}
                                            src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png"
                                            alt="Delete Icon"
                                            style={{ width: '24px', height: 'auto', cursor: 'pointer' }} 
                                        />
                                        <Link to={`/brands/detail/${brand.id}`}>
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
                            {Array.from({ length: Math.ceil(filteredBrands.length / brandsPerPage) }, (_, index) => (
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
                                    disabled={currentPage === Math.ceil(filteredBrands.length / brandsPerPage)}
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

export default Brands;
