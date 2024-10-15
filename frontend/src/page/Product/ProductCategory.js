import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiProduct from '../../api/apiProduct';
import apiBrand from '../../api/apiBrand';
import apiProductPromotion from '../../api/apiProductPromotion'; // Import API để lấy khuyến mãi
import '../../assets/css/ProductCategory.css';
import apiConfiguration from "../../api/apiConfiguration";
import apiColor from "../../api/apiColor";

function ProductCategory() {
    const { slug, brandSlug } = useParams(); // Lấy slug và brandSlug từ URL
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // State để lưu trữ sản phẩm sau khi lọc
    const [brands, setBrands] = useState([]);
    const [productPromotions, setProductPromotions] = useState([]); // State để lưu khuyến mãi
    const [colors, setColors] = useState([]);
    const [configurations, setConfigurations] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]); // State để lưu màu sắc được chọn
    const [selectedConfigurations, setSelectedConfigurations] = useState([]); // State để lưu cấu hình được chọn
    const [isColorsVisible, setIsColorsVisible] = useState(true); // Trạng thái hiển thị màu sắc
    const [isConfigurationsVisible, setIsConfigurationsVisible] = useState(true); // Trạng thái hiển thị cấu hình
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    // useEffect để gọi API lấy danh sách sản phẩm theo slug và brandSlug
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await apiProduct.getProductsByCategory(slug, brandSlug || '');
                const filteredProducts = productsData.filter(product => product.status === 1);
                setProducts(filteredProducts);
                setFilteredProducts(filteredProducts); // Hiển thị tất cả sản phẩm ban đầu

                const promotionsData = await apiProductPromotion.getAllProductPromotions();
                setProductPromotions(promotionsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [slug, brandSlug]); // Gọi lại API khi slug hoặc brandSlug thay đổi

    // useEffect để gọi API lấy danh sách màu sắc và cấu hình
    useEffect(() => {
        apiColor.getAllColors()
            .then(data => setColors(data))
            .catch(error => console.error("Lỗi khi lấy danh sách màu sắc:", error));

        apiConfiguration.getAllConfigurations()
            .then(data => setConfigurations(data))
            .catch(error => console.error("Lỗi khi lấy danh sách cấu hình:", error));
    }, []);

    // useEffect để gọi API lấy danh sách thương hiệu
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await apiBrand.getAllBrands();
                setBrands(data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        fetchBrands();
    }, []);

    // Hàm xử lý khi nhấp vào thương hiệu
    const handleBrandClick = (brandSlug) => {
        // Lấy đường dẫn hiện tại
        const currentPath = window.location.pathname;
    
        // Tách đường dẫn thành các phần tử
        const pathSegments = currentPath.split('/').filter(segment => segment); // Lọc các phân đoạn rỗng
    
        // Kiểm tra thương hiệu hiện tại (phần tử cuối cùng trong đường dẫn)
        const currentBrand = pathSegments.length > 1 ? pathSegments[pathSegments.length - 1] : null;
    
        if (currentBrand === brandSlug) {
            // Nếu thương hiệu hiện tại giống thương hiệu nhấp vào, loại bỏ thương hiệu khỏi đường dẫn
            pathSegments.pop(); // Xóa phần tử cuối cùng (thương hiệu hiện tại)
        } else {
            // Nếu thương hiệu nhấp vào khác với thương hiệu hiện tại, thay thế thương hiệu hiện tại
            if (pathSegments.length > 1) {
                pathSegments[pathSegments.length - 1] = brandSlug;
            } else {
                // Nếu không có thương hiệu trong đường dẫn, thêm thương hiệu mới
                pathSegments.push(brandSlug);
            }
        }
    
        // Tạo đường dẫn mới từ các phân đoạn
        const newPath = `/${pathSegments.join('/')}`;
    
        // Điều hướng đến URL mới
        navigate(newPath);
    };
    
    

    // Hàm tìm khuyến mãi cho một biến thể sản phẩm cụ thể
    const findPromotionForVariant = (variantId) => {
        return productPromotions.find(promotion =>
            promotion.productVariantId === variantId &&
            promotion.priceSale > 0 &&
            promotion.isActive
        );
    };

    // Hàm xử lý khi chọn màu sắc
    const handleColorChange = (colorId) => {
        setSelectedColors(prevSelectedColors =>
            prevSelectedColors.includes(colorId)
                ? prevSelectedColors.filter(id => id !== colorId)
                : [...prevSelectedColors, colorId]
        );
    };

    // Hàm xử lý khi chọn cấu hình
    const handleConfigurationChange = (configurationId) => {
        setSelectedConfigurations(prevSelectedConfigurations =>
            prevSelectedConfigurations.includes(configurationId)
                ? prevSelectedConfigurations.filter(id => id !== configurationId)
                : [...prevSelectedConfigurations, configurationId]
        );
    };

    // Hàm lọc sản phẩm dựa trên các tùy chọn màu sắc và cấu hình
    const filterProducts = () => {
        const filtered = products.filter(product =>
            product.productVariants.some(variant =>
                (selectedColors.length === 0 || selectedColors.includes(variant.colorId)) &&
                (selectedConfigurations.length === 0 || selectedConfigurations.includes(variant.configurationId))
            )
        );
        setFilteredProducts(filtered); // Cập nhật danh sách sản phẩm sau khi lọc
    };

    const toggleColorsVisibility = () => {
        setIsColorsVisible(prevState => !prevState);
    };

    const toggleConfigurationsVisibility = () => {
        setIsConfigurationsVisible(prevState => !prevState);
    };

    // Hàm xử lý điều hướng khi nhấp vào sản phẩm
    const handleProductClick = (slug) => {
        navigate(`/chi-tiet-san-pham/${slug}`);
    };

    // Hàm sắp xếp sản phẩm theo giá tăng dần hoặc giảm dần
    const sortProductsByPrice = (order) => {
        const sorted = [...filteredProducts].sort((a, b) => {
            const getPrice = (product) => {
                const variant = product.productVariants[0];
                const promotion = findPromotionForVariant(variant.id);
                return promotion ? promotion.priceSale : variant.price;
            };

            const priceA = getPrice(a);
            const priceB = getPrice(b);

            return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
        setFilteredProducts(sorted);
    };

    return (
        <div className="container-fluid bg-transparent my-4 p-3">
            <h2>Tất cả sản phẩm</h2>
            <div className="row">
                <div className="brands-list">
                    {brands.map(brand => (
                        <button
                            key={brand.id}
                            onClick={() => handleBrandClick(brand.slug)}
                        >
                            <img src={brand.imageBrand} alt={brand.name} className="brand-image" />
                        </button>
                    ))}
                </div>
                <div className="col-md-2">
                    <div className="sort-options">
                        <h6>Sắp xếp theo giá</h6>
                        <select onChange={(e) => sortProductsByPrice(e.target.value)} className="form-select">
                            <option value="">Chọn</option>
                            <option value="asc">Giá tăng dần</option>
                            <option value="desc">Giá giảm dần</option>
                        </select>
                    </div>
                    <br />
                    <br />
                    <div className="filters">
                        <div className="filter-header">
                            <h2>Bộ Lọc</h2>
                        </div>
                        <div className="colors">
                            <h3 onClick={toggleColorsVisibility} className="filter-toggle">
                                Chọn màu sắc
                                <span className="toggle-icon">{isColorsVisible ? '▲' : '▼'}</span>
                            </h3>
                            {isColorsVisible && (
                                <div className="colors-list">
                                    {colors.map(color => (
                                        <label key={color.id} className="filter-item">
                                            <input
                                                type="checkbox"
                                                value={color.id}
                                                checked={selectedColors.includes(color.id)}
                                                onChange={() => handleColorChange(color.id)}
                                            />
                                            {color.value}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="configurations">
                            <h3 onClick={toggleConfigurationsVisibility} className="filter-toggle">
                                Chọn cấu hình
                                <span className="toggle-icon">{isConfigurationsVisible ? '▲' : '▼'}</span>
                            </h3>
                            {isConfigurationsVisible && (
                                <div className="configurations-list">
                                    {configurations.map(configuration => (
                                        <label key={configuration.id} className="filter-item">
                                            <input
                                                type="checkbox"
                                                value={configuration.id}
                                                checked={selectedConfigurations.includes(configuration.id)}
                                                onChange={() => handleConfigurationChange(configuration.id)}
                                            />
                                            {configuration.value}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={filterProducts} className="btn btn-warning bold-btn">
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <div className="col-md-10">
                    <div className="row">
                        {filteredProducts.map(product => (
                            <div className="col-md-3 col-sm-6 mb-4" key={product.id}>
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
                </div>
            </div>
        </div>
    );
}

export default ProductCategory;
