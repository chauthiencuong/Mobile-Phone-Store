import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiOrder from "../../api/apiOrder";
import apiAuth from "../../api/apiAuth";
import apiProduct from "../../api/apiProduct";

const OrderDetail = () => {
    const { id } = useParams(); // Lấy orderId từ URL
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // Lấy thông tin đơn hàng
                const [orderData, userData, productData] = await Promise.all([
                    apiOrder.getOrderById(id),
                    apiAuth.getAllUsers(),
                    apiProduct.getAllProducts() // Lấy tất cả sản phẩm
                ]);
                setOrder(orderData);
                setUsers(userData);
                setProducts(productData); // Lưu trữ thông tin sản phẩm

                // Lấy chi tiết đơn hàng
                const detailsData = await apiOrder.getOrderDetailsByOrderId(id);
                setOrderDetails(detailsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [id]);

    const getUserName = (userId) => {
        const user = users.find(user => user.id === userId);
        return user ? user.name : "Unknown User";
    };

    const getProductInfo = (productVariantId) => {
        // Tìm sản phẩm dựa trên productVariantId
        const product = products.find(p => p.productVariants.some(v => v.id === productVariantId));
        if (product) {
            // Tìm biến thể của sản phẩm
            const variant = product.productVariants.find(v => v.id === productVariantId);
            return {
                name: product.name,
                image: product.galleries[0]?.imageGallery || "", // Sử dụng ảnh đầu tiên từ galleries
                color: variant.color?.value || "Unknown Color",
                configuration: variant.configuration?.value || "Unknown Configuration"
            };
        }
        return {
            name: "Unknown Product",
            image: "",
            color: "Unknown Color",
            configuration: "Unknown Configuration"
        };
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Tiêu đề căn giữa */}
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{order?.name}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* Thông tin đơn hàng */}
                <div style={{ width: '80%', maxWidth: '800px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    {order && (
                        <>
                            <p><strong>Tên khách hàng:</strong> {getUserName(order.userId)}</p>
                            <p><strong>Ngày đặt hàng:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Địa chỉ nhận hàng:</strong> {order.shippingAddress}</p>
                            <p><strong>Hình thức thanh toán:</strong> {order.paymentMethod}</p>
                            <p><strong>Trạng thái:</strong> {order.status === 0 ? 'Đã đặt hàng' :
                                order.status === 1 ? 'Đã thanh toán' :
                                    order.status === 2 ? 'Đã hủy' :
                                        'Trạng thái không xác định'}</p>
                            <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}</p>
                        </>
                    )}
                </div>

                {/* Chi tiết đơn hàng */}
                <div style={{ width: '80%', maxWidth: '800px', padding: '20px', borderRadius: '8px' }}>
                    <table className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th className="text-center">Hình ảnh</th>
                                <th className="text-center">Tên sản phẩm</th>
                                <th className="text-center">Số lượng</th>
                                <th className="text-center">Giá tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.map(detail => {
                                const { name, image, color, configuration } = getProductInfo(detail.productVariantId);
                                return (
                                    <tr key={detail.id}>
                                        <td className="text-center">
                                            {image && <img src={image} alt={name} style={{ width: "100px", height: "auto" }} />}
                                        </td>
                                        <td className="text-center" >
                                            {name}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                {color !== "Unknown Color" && <span>Màu: {color}</span>}
                                                {configuration !== "Unknown Configuration" && <span>Cấu hình: {configuration}</span>}
                                            </div>
                                        </td>
                                        <td className="text-center">{detail.quantity}</td>
                                        <td className="text-center">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
