import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiProduct from '../../api/apiProduct';
import apiProductPromotion from '../../api/apiProductPromotion'; // Import API để lấy khuyến mãi
import '../../assets/css/ProductNew.css';
import '../../assets/css/Product.css';
import { Carousel } from 'react-bootstrap';

function ProductSale() {
    const [products, setProducts] = useState([]);
    const [productPromotions, setProductPromotions] = useState([]); // State để lưu khuyến mãi
    const navigate = useNavigate(); // Hook để điều hướng

    useEffect(() => {
        const fetchProductsAndPromotions = async () => {
            try {
                // Lấy tất cả sản phẩm
                const productsData = await apiProduct.getAllProducts();
                
                // Lấy tất cả khuyến mãi sản phẩm
                const promotionsData = await apiProductPromotion.getAllProductPromotions();
                setProductPromotions(promotionsData);
    
                // Lọc sản phẩm có khuyến mãi hợp lệ
                const productsWithPromotion = productsData.filter(product => 
                    product.productVariants.some(variant => {
                        const promotion = promotionsData.find(promo => 
                            promo.productVariantId === variant.id &&
                            promo.priceSale > 0 &&
                            promo.isActive
                        );
                        return promotion;
                    })
                );
    
                // Chỉ lấy 12 sản phẩm đầu tiên
                const productsToShow = productsWithPromotion.slice(0, 12);
                setProducts(productsToShow);
    
                console.log(productsData);
                console.log(promotionsData);
            } catch (error) {
                console.error('Error fetching products or promotions:', error);
            }
        };
    
        fetchProductsAndPromotions();
    }, []);
    

    // Tìm khuyến mãi cho một biến thể sản phẩm cụ thể
    const findPromotionForVariant = (variantId) => {
        return productPromotions.find(promotion =>
            promotion.productVariantId === variantId &&
            promotion.priceSale > 0 &&
            promotion.isActive
        );
    };

    // Xử lý điều hướng khi nhấp vào sản phẩm
    const handleProductClick = (slug) => {
        navigate(`/chi-tiet-san-pham/${slug}`);
    };
    // Chia các sản phẩm thành các nhóm 6 sản phẩm cho mỗi slide của Carousel
    const productChunks = [];
    for (let i = 0; i < products.length; i += 6) {
        productChunks.push(products.slice(i, i + 6));
    }

    return (
        <div>
            <div className="container-fluid bg-transparent my-4 p-3">
                <div className="row">
                    <h2 className="promotion-title">Sản phẩm khuyến mại</h2>
                    <Carousel>
                        {productChunks.map((chunk, index) => (
                            <Carousel.Item key={index}>
                                <div className="row">
                                    {chunk.map(product => (
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
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    );
}

export default ProductSale;
