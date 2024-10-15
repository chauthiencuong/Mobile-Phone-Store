import { Routes, Route } from 'react-router-dom';
import ProductDetail from '../page/Product/ProductDetail';
import Cart from '../page/Cart/Cart';
import Login from '../page/User/login';
import Register from '../page/User/register';
import Payment from '../page/Payment/Payment';
import ProductCategory from '../page/Product/ProductCategory';
import Profile from '../page/User/profile';
import ProductAll from '../page/Product/ProductAll';
import ProductBrand from '../page/Product/ProductBrand';
import PromotionPage from '../page/Menu/PromotionPage';
import PostDetail from '../page/Post/PostDetail';
import ScrollToTop from '../ScrollToTop'; // Đường dẫn tới file ScrollToTop.js

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/chi-tiet-san-pham/:slug" element={<ProductDetail />} />
        <Route path="/chi-tiet-bai-viet/:id" element={<PostDetail />} />
        <Route path="/tat-ca-san-pham" element={<ProductAll />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/:slug/:brandSlug?" element={<ProductCategory />} />
        <Route path="/san-pham/:slug" element={<ProductBrand />} />
        <Route path="/p/khuyen-mai" element={<PromotionPage />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
