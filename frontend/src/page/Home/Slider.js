import React, { useState, useEffect } from 'react';
import apiBanner from '../../api/apiBanner';

function Slider() {
    const [banners, setBanners] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bannersData = await apiBanner.getAllBanners();
                setBanners(bannersData);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 3000); // Chuyển slide sau mỗi 3 giây

        return () => clearInterval(intervalId); // Clear interval khi component bị hủy
    }, [banners.length]);

    const handlePrevSlide = () => {
        const newIndex = (activeIndex === 0) ? banners.length - 1 : activeIndex - 1;
        setActiveIndex(newIndex);
    };

    const handleNextSlide = () => {
        const newIndex = (activeIndex === banners.length - 1) ? 0 : activeIndex + 1;
        setActiveIndex(newIndex);
    };

    return (
        <div className="banner">
            <div id="carousel1_indicator" className="slider-home-banner carousel slide">
                <div className="carousel-inner">
                    {banners.map((banner, index) => (
                        <div className={`carousel-item ${index === activeIndex ? 'active' : ''}`} key={index}>
                            <img src={banner.imageBanner} alt={`Slide ${index}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Slider;
