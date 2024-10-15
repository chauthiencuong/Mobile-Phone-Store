import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiOrder from "../../api/apiOrder";
import apiAuth from "../../api/apiAuth";
import apiProduct from "../../api/apiProduct";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const Edit = () => {
    const { id } = useParams(); // Lấy orderId từ URL
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [newShippingAddress, setNewShippingAddress] = useState("");
    const [newPaymentMethod, setNewPaymentMethod] = useState("");
    const [newStatus, setNewStatus] = useState(0);
    const history = useHistory();
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
                setNewShippingAddress(orderData.shippingAddress);
                setNewPaymentMethod(orderData.paymentMethod);
                setNewStatus(orderData.status);

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

    const handleUpdateOrder = async () => {
        try {
            await apiOrder.updateOrder(id, {
                ...order,
                shippingAddress: newShippingAddress,
                paymentMethod: newPaymentMethod,
                status: newStatus
            });
            alert("Cập nhật đơn hàng thành công!");
            history.push('/orders/all')

        } catch (err) {
            setError(err.message);
        }
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
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Địa chỉ nhận hàng"
                                    value={newShippingAddress}
                                    onChange={(e) => setNewShippingAddress(e.target.value)}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Phương thức thanh toán</InputLabel>
                                <Select
                                    value={newPaymentMethod}
                                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                                >
                                    <MenuItem value="Tiền mặt">Thanh toán khi nhận hàng</MenuItem>
                                    <MenuItem value="Momo">Ví Momo</MenuItem>
                                    <MenuItem value="VNPAY">VNPAY</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <MenuItem value={0}>Đã đặt hàng</MenuItem>
                                    <MenuItem value={1}>Đã thanh toán</MenuItem>
                                    <MenuItem value={2}>Đã hũy</MenuItem>
                                </Select>
                            </FormControl>
                            <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}</p>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleUpdateOrder}
                            >
                                Cập nhật
                            </Button>
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
                                        <td className="text-center">
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

export default Edit;
