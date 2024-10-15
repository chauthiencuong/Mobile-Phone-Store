import React, { useState, useEffect } from 'react';
import apiBanner from '../../api/apiBanner';
import apiPromotion from '../../api/apiPromotion';
import '../../assets/css/PromotionPage.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function PromotionPage() {
    const [banners, setBanners] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bannerData = await apiBanner.getAllBanners();
                console.log('Banners:', bannerData); // Kiểm tra dữ liệu banner
                setBanners(bannerData);

                const promotionData = await apiPromotion.getAllPromotions();
                console.log('Promotions:', promotionData); // Kiểm tra dữ liệu promotion
                const activePromotions = promotionData.filter(promotion => promotion.isActive);
                setPromotions(activePromotions);

            } catch (error) {
                setError('Có lỗi xảy ra khi tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 3000); // Chuyển slide sau mỗi 3 giây

        return () => clearInterval(intervalId); // Clear interval khi component bị hủy
    }, [banners.length]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const handleDetailClick = (slug) => {
        navigate(`/`);
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="promotion-page">
            {banners.length > 0 && (
                <div id="carousel" className="carousel slide">
                    <div className="carousel-inner">
                        {banners.map((banner, index) => (
                            <div className={`carousel-item ${index === activeIndex ? 'active' : ''}`} key={index}>
                                <img src={banner.imageBanner} alt={`Slide ${index}`} className="banner-image" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <h1 className="promotion-title">Chương trình khuyến mại</h1>
            <div className="promotion-list">
                {promotions.length > 0 ? (
                    promotions.map((promotion) => (
                        <div key={promotion.id} className="promotion-item">
                            <div className="promotion-image-container">
                                <img
                                    src="https://media.licdn.com/dms/image/C5112AQGNOLniReV7pw/article-cover_image-shrink_600_2000/0/1533264617812?e=2147483647&v=beta&t=xcrCCs8WM_Vd5raxhGdtd81nz-C2qNP9SBcUPb8MpsY" // Placeholder image URL
                                    alt="Khuyến mại"
                                    className="promotion-image"
                                />
                            </div>
                            <div className="promotion-details">
                                <h4 className="promotion-name">{promotion.name}</h4>
                                <p className="promotion-dates">Giảm giá {promotion.discount}% cho sản phẩm</p>
                                <p className="promotion-dates">
                                    {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                                </p>
                                <Button
                                    variant="primary"
                                    className="promotion-detail-button"
                                    onClick={() => handleDetailClick(promotion.id)}
                                >
                                    Xem chi tiết
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không có khuyến mại hiện tại.</p>
                )}
            </div>
        </div>
    );
}

export default PromotionPage;
