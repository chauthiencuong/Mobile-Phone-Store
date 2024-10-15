import React from 'react';
import Category from '../page/Home/Category';
import Slider from '../page/Home/Slider';
import Brand from '../page/Home/Brand';
import Product from '../page/Home/Product';
import ProductNew from '../page/Home/ProductNew';
import ProductSale from '../page/Home/ProductSale';
import PostNew from '../page/Home/PostNew';

function Home() {
    return (
        <div>
            <div className="banner-container">
                <Category />
                <Slider />
                <div className="extra-images">
                    <img src="https://lh3.googleusercontent.com/fkzJ0jxq-3RW3xfboqfIiQIc2D8Fz6pUOX1P8AkthdpajzRiUib6B_L9J-De1iIwqxavjFZUKZ1ZE31j0S5cMJb-RDW3N87ZJA=w300-rw" alt="Extra" />
                    <img src="https://lh3.googleusercontent.com/Byldzv3DplOggbZBi2rmvmDIK8RVakCYewiA_v8t0VKSUbwkTw4aE447TfXpfBXbQgQUTVnEcA9Eh_LfHLc11DR1KQqXxMrm=w300-rw" alt="Extra" />
                </div>
            </div>
            <Brand />
            <Product />
            <ProductNew />
            <ProductSale />
            <PostNew />
        </div>
    );
}

export default Home;
