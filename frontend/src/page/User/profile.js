import React, { useEffect, useState } from 'react';
import '../../assets/css/Profile.css';
import { useUser } from '../../context/UserContext';
import apiOrder from '../../api/apiOrder';
import apiProduct from '../../api/apiProduct';

function Profile() {
    const { user } = useUser();
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [productDetails, setProductDetails] = useState({});

    useEffect(() => {
        apiProduct.getAllProducts()
            .then(data => {
                setProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    useEffect(() => {
        if (user) {
            apiOrder.getOrdersByUserId(user.id)
                .then(data => {
                    // Lọc đơn hàng với status khác 2
                    const filteredOrders = data.filter(order => order.status !== 2);
                    const sortedOrders = filteredOrders.sort((a, b) => b.id - a.id);
                    setOrders(sortedOrders);

                    // Fetch order details for all orders
                    const fetchOrderDetails = sortedOrders.map(order =>
                        apiOrder.getOrderDetailsByOrderId(order.id)
                            .then(details => {
                                // Update orderDetails state
                                setOrderDetails(prev => ({ ...prev, [order.id]: details }));

                                // Find product details for each order detail
                                const productVariantIds = details.map(detail => detail.productVariantId);
                                const detailsMap = {};

                                productVariantIds.forEach(variantId => {
                                    const product = products.find(p =>
                                        p.productVariants.some(v => v.id === variantId)
                                    );

                                    if (product) {
                                        const variant = product.productVariants.find(v => v.id === variantId);
                                        detailsMap[variantId] = {
                                            name: product.name,
                                            image: product.galleries[0]?.imageGallery,
                                            color: variant?.color?.value,
                                            configuration: variant?.configuration?.value
                                        };
                                    }
                                });

                                setProductDetails(prev => ({ ...prev, ...detailsMap }));
                            })
                            .catch(error => console.error('Error fetching order details:', error))
                    );

                    // Wait for all details to be fetched
                    Promise.all(fetchOrderDetails).finally(() => setLoading(false));
                })
                .catch(error => console.error('Error fetching orders:', error))
                .finally(() => setLoading(false));
        }
    }, [user, products]);

    const handleCancelOrder = async (orderId) => {
        alert('Bạn có muốn hủy đơn hàng này không?');
        try {
            await apiOrder.updateOrderStatus(orderId, 2);
            const updatedOrders = orders.filter(order => order.id !== orderId);
            setOrders(updatedOrders);
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    if (!user) {
        return <div>Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.</div>;
    }

    return (
        <>
            <link
                rel="stylesheet"
                href="https://allyoucan.cloud/cdn/icofont/1.0.1/icofont.css"
                integrity="sha384-jbCTJB16Q17718YM9U22iJkhuGbS0Gd2LjaWb4YJEZToOPmnKDjySVa323U+W7Fv"
                crossOrigin="anonymous"
            />
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <div className="osahan-account-page-left shadow-sm bg-white h-100">
                            <div className="border-bottom p-4">
                                <div className="osahan-user text-center">
                                    <div className="osahan-user-media">
                                        <img
                                            className="mb-3 rounded-pill shadow-sm mt-1"
                                            src={user.imageUser}
                                            alt={user.name}
                                        />
                                        <div className="osahan-user-media-body">
                                            <h6 className="mb-2">{user.name}</h6>
                                            <p className="mb-1">{user.phone || 'Số điện thoại không có'}</p>
                                            <p>{user.email}</p>
                                            <p className="mb-0 text-black font-weight-bold">
                                                <a
                                                    className="text-primary mr-3"
                                                    data-toggle="modal"
                                                    data-target="#edit-profile-modal"
                                                    href="#"
                                                >
                                                    <i className="icofont-ui-edit"></i> EDIT
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul className="nav nav-tabs flex-column border-0 pt-4 pl-4 pb-4" id="myTab" role="tablist">
                                <li className="nav-item d-flex align-items-center">
                                    <img src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png" className="nav-icon" />
                                    <span className="ml-2"><i className="icofont-food-cart"></i> Tài khoản của bạn</span>
                                </li>
                                <li className="nav-item d-flex align-items-center">
                                    <img src="https://cdn-icons-png.flaticon.com/128/1156/1156949.png" className="nav-icon" />
                                    <span className="ml-2"><i className="icofont-bell"></i> Thông báo</span>
                                </li>
                                <li className="nav-item d-flex align-items-center">
                                    <img src="https://cdn-icons-png.flaticon.com/128/1376/1376388.png" className="nav-icon" />
                                    <span className="ml-2"><i className="icofont-ticket"></i> Kho voucher</span>
                                </li>
                                <li className="nav-item d-flex align-items-center">
                                    <img src="https://cdn-icons-png.flaticon.com/128/11135/11135307.png" className="nav-icon" />
                                    <span className="ml-2"><i className="icofont-lock"></i> Đổi mật khẩu</span>
                                </li>
                                <li className="nav-item d-flex align-items-center">
                                    <img src="https://cdn-icons-png.flaticon.com/128/16383/16383231.png" className="nav-icon" />
                                    <span className="ml-2"><i className="icofont-lock"></i>Đăng xuất</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="osahan-account-page-right shadow-sm bg-white p-4 h-100">
                            <div className="tab-content" id="myTabContent">
                                <div
                                    className="tab-pane fade active show"
                                    id="orders"
                                    role="tabpanel"
                                    aria-labelledby="orders-tab"
                                >
                                    <div className="order-header">
                                        <img src="https://cdn-icons-png.flaticon.com/128/6632/6632834.png" alt="Order Icon" className="order-icon" />
                                        <h4 className="order-title">Đơn hàng của bạn</h4>
                                    </div>


                                    {loading ? (
                                        <div className="text-center">Đang tải...</div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center">Bạn chưa có đơn hàng nào.</div>
                                    ) : (
                                        <div className="order-list">
                                            {orders.map(order => (
                                                <div key={order.id} className="order-card">
                                                    <div className="order-header">
                                                        <p><strong>Ngày đặt hàng:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                                        <span className={`order-status ${order.status === 0 ? 'pending' : 'paid'}`}>
                                                            {order.status === 0 ? 'Đã đặt hàng' : 'Đã thanh toán'}
                                                        </span>
                                                    </div>
                                                    {orderDetails[order.id] && orderDetails[order.id].length > 0 && (
                                                        <div className="order-items">
                                                            {orderDetails[order.id].map(detail => (
                                                                <div key={detail.productVariantId} className="order-item-detail">
                                                                    {productDetails[detail.productVariantId] && (
                                                                        <div className="product-info1">
                                                                            <img
                                                                                src={productDetails[detail.productVariantId].image}
                                                                                alt="Product"
                                                                                className="product-image"
                                                                            />
                                                                            <div className="product-details">
                                                                                <p className="product-name">
                                                                                    <strong>Tên sản phẩm:</strong> {productDetails[detail.productVariantId].name}
                                                                                </p>
                                                                                {productDetails[detail.productVariantId].color && (
                                                                                    <p className="product-color">
                                                                                        <strong>Màu sắc:</strong> {productDetails[detail.productVariantId].color}
                                                                                    </p>
                                                                                )}
                                                                                {productDetails[detail.productVariantId].configuration && (
                                                                                    <p className="product-configuration">
                                                                                        <strong>Cấu hình:</strong> {productDetails[detail.productVariantId].configuration}
                                                                                    </p>
                                                                                )}
                                                                                <p>
                                                                                    <strong>Số lượng:</strong> {detail.quantity}
                                                                                </p>
                                                                                <p className="product-price">
                                                                                    <strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price)} VND
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="order-info">
                                                        <p><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</p>
                                                        <p><strong>Ghi chú:</strong> {order.note || 'Không có ghi chú'}</p>
                                                        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
                                                    </div>
                                                    {order.status === 0 && (
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => handleCancelOrder(order.id)}
                                                        >
                                                            Hủy đơn hàng
                                                        </button>
                                                    )}
                                                    <div className="order-info-total">
                                                        <p><strong>Thành tiền:</strong></p>
                                                        <p className="total-price">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;