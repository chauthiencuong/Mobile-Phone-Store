import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Brand.css';
import apiBrand from '../../api/apiBrand';

function Brand() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await apiBrand.getAllBrands();
                setBrands(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        fetchBrands();
    }, []);

    return (
        <div className="container">
            <div className="row mt-2 g-4">
                <h2 className="brand-title">Thương hiệu nổi bật</h2>
                {brands.length > 0 ? (
                    brands
                        .filter(brand => brand.status === 1)
                        .map((brand, index) => (
                            <div className="col-md-2" key={index}>
                                <div className="d-flex justify-content-between align-items-center p-2 brand-card">
                                    <Link to={`/san-pham/${brand.slug}`}>
                                        <img src={brand.imageBrand} alt={brand.name} className="brand-image" />
                                    </Link>
                                </div>
                            </div>
                        ))
                ) : (
                    <div>Không có thương hiệu nào</div>
                )}
            </div>
        </div>
    );
}

export default Brand;
