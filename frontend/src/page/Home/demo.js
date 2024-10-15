import React, { useState, useEffect } from 'react';
import apiBanner from '../../api/apiBanner';
import apiCategory from '../../api/apiCategory';

function Slider() {
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const bannersData = await apiBanner.getAllBanners();
                setBanners(bannersData);
                const categoriesData = await apiCategory.getAllCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        }
        fetchData();
    }, []);
	const handlePrevSlide = () => {
        const newIndex = (activeIndex === 0) ? banners.length - 1 : activeIndex - 1;
        setActiveIndex(newIndex);
    };

    const handleNextSlide = () => {
        const newIndex = (activeIndex === banners.length - 1) ? 0 : activeIndex + 1;
        setActiveIndex(newIndex);
    };

    return (
        <section className="section-main padding-y">
            <main className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-9 col-xl-7 col-lg-7">
                            <div id="carousel1_indicator" className="slider-home-banner carousel slide" data-ride="carousel">
							<ol className="carousel-indicators">
                                    {banners.map((banner, index) => (
                                        <li key={index} data-target="#carousel1_indicator" data-slide-to={index} className={index === activeIndex ? 'active' : ''}></li>
                                    ))}
                                </ol>
                                <div className="carousel-inner">
								{banners.map((banner, index) => (
                                        <div className={`carousel-item ${index === activeIndex ? 'active' : ''}`} key={index}>
                                            <img src={banner.imageBanner} alt={`Banner ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
								<a className="carousel-control-prev" href="#" role="button" onClick={handlePrevSlide}>
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#" role="button" onClick={handleNextSlide}>
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    );
}

export default Slider;
