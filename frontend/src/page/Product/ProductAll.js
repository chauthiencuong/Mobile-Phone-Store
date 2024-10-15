import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiProduct from '../../api/apiProduct';
import apiProductPromotion from '../../api/apiProductPromotion';
import '../../assets/css/Product.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

function ProductAll() {
    const [products, setProducts] = useState([]);
    const [productPromotions, setProductPromotions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [sortOrder, setSortOrder] = useState(''); // Đặt mặc định là chuỗi rỗng
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductsAndPromotions = async () => {
            try {
                const productsData = await apiProduct.getAllProducts();
                const filteredProducts = productsData.filter(product => product.status === 1);
                setProducts(filteredProducts);

                const promotionsData = await apiProductPromotion.getAllProductPromotions();
                setProductPromotions(promotionsData);
            } catch (error) {
                console.error('Error fetching products or promotions:', error);
            }
        };

        fetchProductsAndPromotions();
    }, []);

    const findPromotionForVariant = (variantId) => {
        return productPromotions.find(promotion =>
            promotion.productVariantId === variantId &&
            promotion.priceSale > 0 &&
            promotion.isActive
        );
    };

    const sortProductsByPrice = (order) => {
        const sorted = [...products].sort((a, b) => {
            const getPrice = (product) => {
                const variant = product.productVariants[0];
                const promotion = findPromotionForVariant(variant.id);
                return promotion ? promotion.priceSale : variant.price;
            };

            const priceA = getPrice(a);
            const priceB = getPrice(b);

            return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
        setProducts(sorted);
    };

    const handleSortChange = (e) => {
        const selectedOrder = e.target.value;
        setSortOrder(selectedOrder);
        if (selectedOrder === '') {
            // Nếu không có sắp xếp, không thay đổi thứ tự sản phẩm
            return;
        }
        sortProductsByPrice(selectedOrder);
    };

    const handleProductClick = (slug) => {
        navigate(`/chi-tiet-san-pham/${slug}`);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(products.length / productsPerPage);

    return (
        <div>
            <div className="container-fluid bg-transparent my-4 p-3">
                <div className="row">
                    <h2 className="promotion-title">Tất cả sản phẩm</h2>

                    {/* Dropdown sắp xếp sản phẩm */}
                    <div className="mb-3">
                        <label>Sắp xếp theo giá:</label>
                        <br />
                        <select value={sortOrder} onChange={handleSortChange} className="form-select d-inline-block w-auto">
                            <option value="">Chọn</option>
                            <option value="asc">Giá tăng dần</option>
                            <option value="desc">Giá giảm dần</option>
                        </select>
                    </div>

                    {currentProducts.map(product => (
                        <div className="col-md-2 col-sm-4" key={product.id}>
                            <div className="card h-100">
                                <a onClick={() => handleProductClick(product.slug)} style={{ cursor: 'pointer' }}>
                                    {product.galleries.length > 0 ? (
                                        <img
                                            src={product.galleries[0].imageGallery}
                                            className="card-img-top"
                                            alt={product.name}
                                        />
                                    ) : (
                                        <img
                                            src="https://via.placeholder.com/150"
                                            className="card-img-top"
                                            alt="Placeholder"
                                        />
                                    )}
                                </a>
                                {product.productVariants.length > 0 ? (
                                    (() => {
                                        const variant = product.productVariants[0];
                                        const promotion = findPromotionForVariant(variant.id);
                                        return (
                                            <div className="discount-info">
                                                {promotion ? (
                                                    <span className="badge rounded-pill bg-danger">
                                                        -{promotion.promotion.discount}%
                                                    </span>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        );
                                    })()
                                ) : (
                                    'No Discount Info'
                                )}
                                
                                <div className="card-body">
                                    <div className="clearfix mb-3 d-flex align-items-center">
                                        {product.productVariants.length > 0 ? (
                                            (() => {
                                                const variant = product.productVariants[0];
                                                const promotion = findPromotionForVariant(variant.id);
                                                const displayPrice = promotion ? promotion.priceSale : variant.price;
                                                return (
                                                    <div className="price-container">
                                                        {promotion ? (
                                                            <>
                                                                {promotion.priceSale !== variant.price && (
                                                                    <span className="badge rounded-pill original-price">
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price)}
                                                                    </span>
                                                                )}
                                                                <span className="badge rounded-pill price-sale">
                                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="badge rounded-pill price-only">
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            'Giá không có sẵn'
                                        )}
                                    </div>
                                    <h5 className="card-title">
                                        <a href="#" onClick={() => handleProductClick(product.slug)} style={{ cursor: 'pointer' }}>
                                            {product.name}
                                        </a>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Phân trang */}
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                <FontAwesomeIcon icon={faAngleLeft} style={{ cursor: 'pointer' }} />
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                <FontAwesomeIcon icon={faAngleRight} style={{ cursor: 'pointer' }} />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default ProductAll;
