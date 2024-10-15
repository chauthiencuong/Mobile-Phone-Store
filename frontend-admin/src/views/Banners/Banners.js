import React, { useEffect, useState } from "react";
import { Box, TextField } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiBanner from "../../api/apiBanner";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../Orders/Orders.css';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');  // State để lưu giá trị tìm kiếm
    const [currentPage, setCurrentPage] = useState(1);
    const [bannersPerPage] = useState(6); // Số lượng banner trên mỗi trang

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await apiBanner.getAllBanners();
                setBanners(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset trang về 1 khi tìm kiếm
    };

    // Lọc danh mục dựa trên giá trị tìm kiếm
    const filteredBanners = banners.filter(banner =>
        banner.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Xử lý phân trang
    const indexOfLastBanner = currentPage * bannersPerPage;
    const indexOfFirstBanner = indexOfLastBanner - bannersPerPage;
    const currentBanners = filteredBanners.slice(indexOfFirstBanner, indexOfLastBanner);

    // Thay đổi trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const deleteBanner = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa banner này?")) {
            try {
                await apiBanner.deleteBanner(id);
                setBanners(banners.filter(banner => banner.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <React.Fragment>
            <PageHeader title='Quản lý banner' />
            <PageBody style={{ display: "flex", justifyContent: "center" }}>
                <Box
                    flexGrow='1'
                    width='90%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                >
                    <TextField 
                        label="Tìm kiếm banner"
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
                                <th scope="col" className="text-center">Tên banner</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Trạng thái</th>
                                <th scope="col" className="text-center" style={{ width: '120px' }}>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBanners.map(banner => (
                                <tr key={banner.id}>
                                    <th className="text-center">{banner.id}</th>
                                    <td className="text-center">
                                        {banner.imageBanner && (
                                            <img
                                                src={banner.imageBanner}
                                                alt={banner.name}
                                                style={{ width: 'auto', height: '60px' }} 
                                            />
                                        )}
                                    </td>
                                    <td className="text-center">{banner.name}</td>
                                    <td className="text-center">{banner.status === 1 ? 'Hiển thị' : 'Ẩn'}</td>
                                    <td className="text-center">
                                        <Link to={`/banners/edit/${banner.id}`}>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/128/3597/3597075.png"
                                                alt="Edit Icon"
                                                style={{ width: '24px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                                            />
                                        </Link>
                                        <img onClick={() => deleteBanner(banner.id)}
                                            src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png"
                                            alt="Delete Icon"
                                            style={{ width: '24px', height: 'auto', cursor: 'pointer' }} 
                                        />
                                        <Link to={`/banners/detail/${banner.id}`}>
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
                            {Array.from({ length: Math.ceil(filteredBanners.length / bannersPerPage) }, (_, index) => (
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
                                    disabled={currentPage === Math.ceil(filteredBanners.length / bannersPerPage)}
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

export default Banners;
