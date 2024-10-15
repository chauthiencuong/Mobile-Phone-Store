import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Thêm import này
import apiCart from '../../api/apiCart';
import apiProduct from '../../api/apiProduct';
import '../../assets/css/Cart.css';
import { useUser } from '../../context/UserContext';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [products, setProducts] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();  // Thêm hook navigate

    const userId = user ? user.id : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userId) {
                    const cartData = await apiCart.getCart(userId);
                    const allProducts = await apiProduct.getAllProducts();

                    const totalAmount = cartData.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

                    const updatedCartItems = cartData.cartItems.map(item => {
                        const product = allProducts.find(p => p.productVariants.some(v => v.id === item.productVariantId));
                        return {
                            ...item,
                            productImage: product && product.galleries.length > 0 ? product.galleries[0].imageGallery : ''
                        };
                    });

                    setCartItems(updatedCartItems);
                    setTotal(totalAmount);
                    setProducts(allProducts);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId]);

    const handleRemoveFromCart = async (productVariantId) => {
        try {
            if (userId) {
                await apiCart.removeFromCart(userId, productVariantId);
                const updatedCart = await apiCart.getCart(userId);
                const updatedCartItems = updatedCart.cartItems.map(item => {
                    const product = products.find(p => p.productVariants.some(v => v.id === item.productVariantId));
                    return {
                        ...item,
                        productImage: product && product.galleries.length > 0 ? product.galleries[0].imageGallery : ''
                    };
                });
                setCartItems(updatedCartItems);
                setTotal(updatedCart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            if (userId) {
                await apiCart.clearCart(userId);
                setCartItems([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const handleQuantityChange = async (productVariantId, newQuantity) => {
        try {
            if (userId) {
                await apiCart.updateCart(userId, productVariantId, newQuantity);
                const updatedCart = await apiCart.getCart(userId);
                const updatedCartItems = updatedCart.cartItems.map(item => {
                    const product = products.find(p => p.productVariants.some(v => v.id === item.productVariantId));
                    return {
                        ...item,
                        productImage: product && product.galleries.length > 0 ? product.galleries[0].imageGallery : ''
                    };
                });

                setCartItems(updatedCartItems);
                setTotal(updatedCart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
        }
    };

    const handleIncreaseQuantity = (productVariantId, quantity) => {
        const newQuantity = quantity + 1;
        handleQuantityChange(productVariantId, newQuantity);
    };

    const handleDecreaseQuantity = (productVariantId, quantity) => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            handleQuantityChange(productVariantId, newQuantity);
        }
    };

    const handleProceedToPayment = () => {
        // Lưu dữ liệu giỏ hàng vào context hoặc state để chuyển tới trang thanh toán
        const cartData = {
            items: cartItems,
            total: total
        };
        navigate('/payment', { state: { cartData } });  // Chuyển đến trang thanh toán và truyền dữ liệu giỏ hàng
    };

    if (!userId) {
        return <div>Giỏ hàng trống</div>;
    }

    return (
        <div className="container padding-bottom-3x mb-1">
            <div className="table-responsive shopping-cart">
                <h2>Giỏ hàng</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">Sản phẩm</th>
                            <th className="text-center">Số lượng</th>
                            <th className="text-center">Giá tiền</th>
                            <th className="text-center">Thành tiền</th>
                            <th className="text-center">
                                <a className="btn btn-sm btn-outline-danger" href="#" onClick={handleClearCart}>Xóa giỏ hàng</a>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.productVariantId}>
                                <td>
                                    <div className="product-item">
                                        <a className="product-thumb" href="#">
                                            <img src={item.productImage} alt="Product" />
                                        </a>
                                        <div className="product-info">
                                            <h4 className="product-title">
                                                <a href="#" >{item.productName}</a>
                                            </h4>
                                            {item.configurationName !== 'Không' && (
                                                <span><em>Cấu hình:</em> {item.configurationName}</span>
                                            )}
                                            {item.colorName !== 'Không' && (
                                                <span><em>Màu sắc:</em> {item.colorName}</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="quantity-controls">
                                        <button className="btn btn-outline-secondary" onClick={() => handleDecreaseQuantity(item.productVariantId, item.quantity)}>-</button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            readOnly
                                        />
                                        <button className="btn btn-outline-secondary" onClick={() => handleIncreaseQuantity(item.productVariantId, item.quantity)}>+</button>
                                    </div>
                                </td>
                                <td className="text-center text-lg text-medium">
                                    {item.price} đ
                                </td>
                                <td className="text-center text-lg text-medium">
                                    {item.price * item.quantity} đ
                                </td>
                                <td className="text-center">
                                    <a className="remove-from-cart" href="#" title="Remove item" onClick={() => handleRemoveFromCart(item.productVariantId)}>
                                        <i className="fa fa-trash"></i>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="shopping-cart-footer">
                <div className="column text-lg">
                    Tổng cộng: <span className="text-medium">{total} đ</span>
                </div>
            </div>
            <div className="shopping-cart-footer">
                <div className="column">
                    <a className="btn btn-outline-secondary" href="#">
                        <i className="icon-arrow-left"></i>&nbsp;Tiếp tục mua hàng
                    </a>
                </div>
                <div className="column">
                    <button className="btn btn-success" onClick={handleProceedToPayment}>Thanh toán</button>
                </div>
            </div>
        </div>
    );
}

export default Cart;
