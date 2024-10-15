import React, { useState, useEffect } from "react";
import { Box, TextField } from "@material-ui/core";
import { PageBody, PageHeader } from "../../components";
import apiProduct from '../../api/apiProduct';
import apiProductPromotion from '../../api/apiProductPromotion';  // Import API khuyến mãi
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../Orders/Orders.css';

const ProductPromotion = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const productsPerPage = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await apiProduct.getAllProducts();
                const sortedProducts = productsData.sort((a, b) => b.id - a.id);
                
                // Lấy priceSale cho từng sản phẩm
                const productsWithPromotion = await Promise.all(sortedProducts.map(async (product) => {
                    const promotions = await apiProductPromotion.getPromotionsByProductId(product.id);
                    if (promotions.length > 0) {
                        return {
                            ...product,
                            priceSale: promotions[0].priceSale,
                        };
                    } else {
                        return {
                            ...product,
                            priceSale: null,
                        };
                    }
                }));
    
                setProducts(productsWithPromotion.filter(product => product.priceSale !== null));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const deleteProduct = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                await apiProduct.deleteProduct(id);
                setProducts(products.filter(product => product.id !== id));
            } catch (error) {
                setError(error.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <React.Fragment>
            <PageHeader title='Quản lý sản phẩm khuyến mại' />
            <PageBody style={{ display: "flex" }}>
                <Box
                    flexGrow='1'
                    width='100%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                >
                    <TextField
                        label="Tìm kiếm sản phẩm"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}
                    />
                    
                    {filteredProducts.length > 0 && (
                        <table className="table table-bordered" style={{ width: '100%', maxWidth: '900px' }}>
                            <thead>
                                <tr>
                                    <th scope="col" className="text-center" style={{ width: '10px' }}>ID</th>
                                    <th scope="col" className="text-center" style={{ width: '120px' }}>Hình</th>
                                    <th scope="col" className="text-center">Tên sản phẩm</th>
                                    <th scope="col" className="text-center">Danh mục</th>
                                    <th scope="col" className="text-center">Thương hiệu</th>
                                    <th scope="col" className="text-center">Giá gốc</th>
                                    <th scope="col" className="text-center">Giá giảm</th>
                                    <th scope="col" className="text-center" style={{ width: '100px' }}>Trạng thái</th>
                                    <th scope="col" className="text-center" style={{ width: '120px' }}>Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map(product => (
                                    <tr key={product.id}>
                                        <th className="text-center" scope="row">{product.id}</th>
                                        <td className="text-center">
                                            {product.galleries.length > 0 ? (
                                                <img
                                                    src={product.galleries[0].imageGallery}
                                                    alt={product.name}
                                                    style={{ width: '100px', height: 'auto' }}
                                                />
                                            ) : (
                                                <img
                                                    src="https://via.placeholder.com/100"
                                                    alt="Placeholder"
                                                    style={{ width: '100px', height: 'auto' }}
                                                />
                                            )}
                                        </td>
                                        <td className="text-center">{product.name}</td>
                                        <td className="text-center">{product.category ? product.category.name : 'Chưa có thông tin'}</td>
                                        <td className="text-center">{product.brand ? product.brand.name : 'Chưa có thông tin'}</td>
                                        <td className="text-center">{product.productVariants.length > 0 ? product.productVariants[0].price.toLocaleString() + ' đ' : 'Chưa có thông tin'}</td>
                                        <td className="text-center">{product.priceSale ? product.priceSale.toLocaleString() + ' đ' : 'Chưa có thông tin'}</td> {/* Hiển thị giá giảm */}
                                        <td className="text-center">
                                            {product.status === 1 ? 'Hiển thị' : 'Ẩn'}
                                        </td> 
                                        <td className="text-center">
                                            <Link to={`/products/edit/${product.id}`}>
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/128/3597/3597075.png"
                                                    alt="Edit Icon"
                                                    style={{ width: '24px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                                                />
                                            </Link>
                                            <img
                                                onClick={() => deleteProduct(product.id)}
                                                src="https://cdn-icons-png.flaticon.com/128/11540/11540197.png"
                                                alt="Delete Icon"
                                                style={{ width: '24px', height: 'auto', cursor: 'pointer' }} 
                                            />
                                            <Link to={`/products/detail/${product.id}`}>
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/128/1265/1265907.png"
                                                    alt="Details Icon"
                                                    style={{ width: '24px', height: 'auto', marginLeft: '8px' }}
                                                />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
                            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
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
                                    disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
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

export default ProductPromotion;
