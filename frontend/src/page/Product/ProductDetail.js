import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiProduct from '../../api/apiProduct';
import apiCart from '../../api/apiCart';
import apiProductPromotion from '../../api/apiProductPromotion';
import '../../assets/css/ProductDetail.css';
import { useUser } from '../../context/UserContext';
import apiReview from '../../api/apiReview'; // Import apiReview

function ProductDetail() {
    const { user } = useUser();
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [promotions, setPromotions] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedConfiguration, setSelectedConfiguration] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]); // State for reviews

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productData = await apiProduct.getProductBySlug(slug);
                setProduct(productData);

                const promotionsData = await apiProductPromotion.getAllProductPromotions();
                setPromotions(promotionsData);

                // Lấy sản phẩm liên quan
                if (productData) {
                    const relatedProductsData = await apiProduct.getProductsByCategoryAndBrand(productData.categoryId, productData.brandId);
                    // Loại bỏ sản phẩm hiện tại khỏi danh sách sản phẩm liên quan
                    const filteredRelatedProducts = relatedProductsData.filter(p => p.id !== productData.id);
                    setRelatedProducts(filteredRelatedProducts.slice(0, 4)); // Lấy 4 sản phẩm liên quan
                }

                if (productData && productData.productVariants.length > 0) {
                    const firstVariant = productData.productVariants[0];

                    setSelectedColor(firstVariant.colorId);
                    setSelectedConfiguration(firstVariant.configurationId);
                    setSelectedImage(productData.galleries[0]?.imageGallery || 'https://via.placeholder.com/500');
                    setSelectedVariant(firstVariant);

                    const reviewsData = await apiReview.getReviewsOfProductId(productData.id);
                    setReviews(reviewsData);
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProductData();
    }, [slug]);

    useEffect(() => {
        if (product) {
            const variant = product.productVariants.find(variant =>
                variant.colorId === selectedColor &&
                variant.configurationId === selectedConfiguration
            );
            setSelectedVariant(variant);
        }
    }, [selectedColor, selectedConfiguration, product]);

    const findPromotionForVariant = (variantId) => {
        return promotions.find(promotion =>
            promotion.productVariantId === variantId &&
            promotion.priceSale > 0 &&
            promotion.isActive
        );
    };

    const uniqueColors = [...new Set(product?.productVariants.map(variant => variant.colorId))];
    const uniqueConfigurations = [...new Set(product?.productVariants.map(variant => variant.configurationId))];

    if (!product) return <p>Loading...</p>;

    const getMainImage = () => {
        return selectedImage;
    };

    const handleAddToCart = async () => {
        if (!user) {
            alert("Bạn cần đăng nhập để mua hàng");
            navigate('/login');
        }
        if (selectedVariant) {
            const availableQty = selectedVariant.qty;

            if (quantity > availableQty) {
                alert(`Số lượng không thể vượt quá ${availableQty} sản phẩm.`);
                return;
            }

            try {
                await apiCart.addToCart(user.id, selectedVariant.id, quantity);
                alert('Sản phẩm đã được thêm vào giỏ hàng!');
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        } else {
            alert('Vui lòng chọn biến thể sản phẩm trước.');
        }
    };

    const handleQuantityChange = (change) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + change));
    };

    const handleQuantityInputChange = (event) => {
        const value = event.target.value;
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue) && parsedValue > 0) {
            setQuantity(parsedValue);
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form

        if (!user) {
            alert("Bạn cần đăng nhập để đánh giá về sản phẩm");
            navigate('/login');
            return; // Dừng hàm nếu người dùng chưa đăng nhập
        }

        const rating = document.getElementById('rating').value; // Lấy giá trị của trường đánh giá
        const comment = document.getElementById('comment').value; // Lấy giá trị của trường bình luận

        if (!rating || !comment) {
            alert("Vui lòng điền đầy đủ thông tin đánh giá và bình luận.");
            return; // Dừng hàm nếu thiếu thông tin
        }

        const reviewData = {
            productId: product.id,
            userId: user.id,
            comment: comment,
            rating: parseInt(rating) // Chuyển đổi giá trị rating thành số nguyên
        };

        try {
            await apiReview.createReview(reviewData); // Gọi API để tạo đánh giá
            alert("Cảm ơn bạn đã góp ý về sản phẩm của chúng tôi!");

            // Xóa các trường sau khi gửi đánh giá thành công
            document.getElementById('comment').value = '';
            document.getElementById('rating').value = '5'; // Reset giá trị đánh giá về mặc định

            // Làm mới danh sách đánh giá sau khi gửi
            const updatedReviews = await apiReview.getReviewsOfProductId(product.id);
            setReviews(updatedReviews);

        } catch (error) {
            console.error('Error adding review:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
        }
    };

    return (
        <div className="pd-wrap">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="product-images">
                            <div className="main-img">
                                <img src={getMainImage()} alt="Main Product" />
                            </div>
                            <div className="thumb-imgs">
                                {product.galleries.map((gallery) => (
                                    <img
                                        key={gallery.id}
                                        src={gallery.imageGallery}
                                        alt={`Thumbnail ${gallery.id}`}
                                        onClick={() => setSelectedImage(gallery.imageGallery)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="product-dtl">
                            <div className="product-info">
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">
                                    {selectedVariant ? (
                                        <>
                                            {findPromotionForVariant(selectedVariant.id) ? (
                                                <>
                                                    <span className="original-price1">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVariant.price)}
                                                    </span>
                                                    <span className="price-sale1">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(findPromotionForVariant(selectedVariant.id).priceSale)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="price-only1">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVariant.price)}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        'Price not available'
                                    )}
                                </div>
                            </div>
                            <div className="product-brand">
                                <strong>Thương hiệu: </strong>{product.brand?.name}
                            </div>
                            <div className="product-cat">
                                <strong>Danh mục: </strong>{product.category?.name}
                            </div>
                            <div className="product-sku">
                                <strong>SKU: </strong>{product.sku}
                            </div>
                            <br />
                            <p>{product.description}</p>
                            <div className="row">
                                {product?.productVariants.length > 1 && (
                                    <>
                                        <div className="col-md-15">
                                            <h6>Chọn cấu hình và màu sắc để xem giá</h6>
                                            <div className="config-options">
                                                {uniqueConfigurations.map((config, index) => {
                                                    const isConfigAvailable = product.productVariants.some(variant => variant.configurationId === config && variant.colorId === selectedColor);

                                                    return (
                                                        <span
                                                            key={index}
                                                            className={`config-option ${selectedConfiguration === config ? 'selected' : ''} ${!isConfigAvailable ? 'disabled' : ''}`}
                                                            onClick={() => isConfigAvailable && setSelectedConfiguration(config)}
                                                            data-toggle="tooltip"
                                                            title={product.productVariants.find(variant => variant.configurationId === config)?.configuration?.value}
                                                        >
                                                            {product.productVariants.find(variant => variant.configurationId === config)?.configuration?.value}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                            <div className="color-options">
                                                {uniqueColors.map((color, index) => {
                                                    const isColorAvailable = product.productVariants.some(variant => variant.colorId === color && variant.configurationId === selectedConfiguration);

                                                    return (
                                                        <span
                                                            key={index}
                                                            className={`color-option ${selectedColor === color ? 'selected' : ''} ${!isColorAvailable ? 'disabled' : ''}`}
                                                            onClick={() => isColorAvailable && setSelectedColor(color)}
                                                            data-toggle="tooltip"
                                                            title={product.productVariants.find(variant => variant.colorId === color)?.color?.value}
                                                        >
                                                            {product.productVariants.find(variant => variant.colorId === color)?.color?.value}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="product-count">
                                <label>Số lượng:</label>
                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(-1)}>-</button>
                                    <input
                                        id="quantity"
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityInputChange}
                                    />
                                    <button onClick={() => handleQuantityChange(1)}>+</button>
                                </div>
                            </div>
                            <div className="d-grid gap-2 my-3">
                                <a href="#" className="btn custom-btn" onClick={handleAddToCart}>Thêm vào giỏ</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Phần sản phẩm liên quan */}
            <div className="related-products">
                <h3>Sản phẩm liên quan</h3>
                <div className="row">
                    {relatedProducts.length > 0 ? (
                        relatedProducts.map(product => (
                            <div key={product.id} className="col-md-3">
                                <div className="related-product-card">
                                    <img src={product.galleries[0]?.imageGallery || 'https://via.placeholder.com/150'} alt={product.name} />
                                    <div className="related-product-info">
                                        <h5>{product.name}</h5>
                                        <div className="related-product-price">
                                            {product.productVariants[0] ? (
                                                <span className="price-only">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.productVariants[0].price)}
                                                </span>
                                            ) : (
                                                'Giá không có sẵn'
                                            )}
                                        </div>
                                        <button
                                            className="btn-view-details"
                                            onClick={() => {
                                                window.scrollTo(0, 0); // Cuộn về đầu trang
                                                navigate(`/chi-tiet-san-pham/${product.slug}`);
                                            }}
                                        >
                                            Xem chi tiết
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có sản phẩm liên quan.</p>
                    )}
                </div>
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12">
                            <h3 style={{ color: "red" }}>Đánh giá & nhận xét về {product.name}</h3>
                            <div id="comment-section">
                                {reviews.map((review, index) => (
                                    <div key={index} class="comment">
                                        <div class="user">Tên khách hàng: {review.user.name}</div>
                                        <div class="date">{new Date(review.createdAt).toLocaleString()}</div>
                                        <div className="rating"> Đánh giá:
                                            <span className="stars">
                                                {Array.from({ length: review.rating }, (_, i) => (
                                                    <span key={i}>&#9733;</span>
                                                ))}
                                            </span>
                                        </div>
                                        <div class="content">
                                            {review.comment}.
                                        </div>
                                    </div>
                                ))}
                                {/*<div class="comment">
                                <div class="user">Admin</div>
                                <div class="date">Ngày: 2024-05-24</div>
                                <div class="content">
                                    Cảm ơn bạn đã chia sẻ đánh giá. Chúng tôi rất vui mừng khi bạn hài lòng với sản phẩm và dịch vụ của chúng tôi!
                                </div>
                            </div>
                        */}
                            </div>
                            <div id="comment-form">
                                <h4>Để lại đánh giá và phản hồi</h4>
                                <form onSubmit={handleSubmit}>
                                    <div class="form-group">
                                        <label for="rating">Đánh giá:</label>
                                        <select class="form-control" id="rating" name="rating">
                                            <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733;</option>
                                            <option value="4">&#9733;&#9733;&#9733;&#9733;</option>
                                            <option value="3">&#9733;&#9733;&#9733;</option>
                                            <option value="2">&#9733;&#9733;</option>
                                            <option value="1">&#9733;</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="comment">Bình luận:</label>
                                        <textarea class="form-control" id="comment" name="comment" rows="3"></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Gửi phản hồi</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
