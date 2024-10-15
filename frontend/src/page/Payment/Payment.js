import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import apiOrder from '../../api/apiOrder'; // Import API methods
import apiCart from '../../api/apiCart'; // Import API methods
import '../../assets/css/Payment.css';

// Tạo tên đơn hàng ngẫu nhiên
function generateOrderName() {
  const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `Đơn hàng ${randomNumber}`;
}

function Payment() {
  const location = useLocation();
  const { cartData } = location.state || {};  // Lấy dữ liệu giỏ hàng từ location.state
  const { user } = useUser();  // Lấy thông tin người dùng từ context
  const navigate = useNavigate();  // Thêm hook navigate
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt'); // Cập nhật giá trị mặc định

  // Kiểm tra dữ liệu giỏ hàng và người dùng
  if (!cartData) {
    return <div>Không có dữ liệu giỏ hàng</div>;
  }

  if (!user) {
    return <div>Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.</div>;
  }

  // Hàm xử lý thanh toán
  const handlePayment = async () => {
    try {
      // Tạo thông tin đơn hàng
      const order = {
        userId: user.id,
        name: generateOrderName(),
        note,
        shippingAddress,
        totalPrice: cartData.total,
        paymentMethod: paymentMethod,
        status: paymentMethod === 'MoMo' ? 1 : 0, // Đặt trạng thái tương ứng cho MoMo hoặc Tiền mặt
      };

      // Tạo chi tiết đơn hàng từ giỏ hàng
      const orderDetails = cartData.items.map(item => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        price: item.price,
      }));

      if (paymentMethod === 'MoMo') {
        // Tạo dữ liệu thanh toán MoMo
        const paymentData = {
          createOrderDTO: order,
          orderDetails: orderDetails,
        };

        // Gọi API thanh toán MoMo
        const paymentResponse = await apiOrder.createPaymentMomo(paymentData);
        if (paymentResponse && paymentResponse.payUrl) {
          // Chuyển hướng đến URL thanh toán MoMo
          window.location.href = paymentResponse.payUrl;

          // Xóa giỏ hàng sau khi chuyển hướng đến MoMo
          await apiCart.clearCart(user.id);
          return; // Dừng tiếp tục thực hiện nếu đã điều hướng
        }
      } else {
        // Tạo đơn hàng nếu thanh toán bằng tiền mặt
        const orderResponse = await apiOrder.createOrder(order);
        const orderId = orderResponse?.id;

        if (orderId) {
          // Tạo chi tiết đơn hàng với orderId
          const orderDetailsPayload = orderDetails.map(detail => ({
            orderId, // Gán orderId cho từng chi tiết
            ...detail,
          }));

          await apiOrder.createOrderDetail(orderDetailsPayload);

          // Hoàn tất quy trình cho thanh toán bằng tiền mặt
          alert('Đặt hàng thành công!');
          await apiCart.clearCart(user.id);
          navigate('/profile');
        } else {
          throw new Error('Không thể lấy thông tin đơn hàng.');
        }
      }
    } catch (error) {
      console.error('Error in handlePayment:', error.message);
      alert('Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Thanh Toán</h1>
      <div className="flex-container">
        {/* Thông tin người dùng */}
        <div className="user-info">
          <h3>Thông Tin Người Dùng</h3>
          <div className="input-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              id="fullName"
              type="text"
              placeholder="Nhập họ và tên"
              defaultValue={user.name || ''}
              readOnly
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Nhập email"
              defaultValue={user.email || ''}
              readOnly
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              defaultValue={user.phone || ''}
              readOnly
            />
          </div>
          <div className="input-group">
            <label htmlFor="address">Địa chỉ nhận hàng</label>
            <textarea
              id="address"
              placeholder="Nhập địa chỉ"
              rows="4"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="note">Ghi chú</label>
            <textarea
              id="note"
              placeholder="Nhập ghi chú"
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="payment-options">
            <div className="payment-option">
              <input
                type="radio"
                id="paymentCash"
                name="paymentMethod"
                value="Tiền mặt"
                checked={paymentMethod === 'Tiền mặt'}
                onChange={() => setPaymentMethod('Tiền mặt')}
              />
              <label htmlFor="paymentCash">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8t0MN6IYuQUqX86al9JV-jA-12HjuYDKbJQ&s"
                  alt="Thanh toán khi nhận hàng"
                  style={{ width: '100px', height: '80px' }}
                />
                <p>Thanh toán khi nhận hàng</p>
              </label>
            </div>
            <div className="payment-option">
              <input
                type="radio"
                id="paymentMoMo"
                name="paymentMethod"
                value="MoMo"
                checked={paymentMethod === 'MoMo'}
                onChange={() => setPaymentMethod('MoMo')}
              />
              <label htmlFor="paymentMoMo">
                <img
                  src="https://yt3.googleusercontent.com/Adl058Y4P2i0ZCMY3Hfoe0GdFb9SInZ9dS1dvhy4yD2DuAGizku7wfCDjbWLH3FSBKtXPi7cIQ=s900-c-k-c0x00ffffff-no-rj"
                  alt="Thanh toán với Momo"
                  style={{ width: '100px', height: '80px' }}
                />
                <p>Thanh toán với Momo</p>
              </label>
            </div>
          </div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="order-info">
          <h3>Thông Tin Đơn Hàng</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá tiền</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {cartData.items.map(item => (
                <tr key={item.productVariantId}>
                  <td>
                    <img src={item.productImage} alt={item.productName} style={{ width: '100px', height: 'auto' }} />
                  </td>
                  <td>
                    <div>{item.productName}</div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                      {item.colorName && item.colorName !== 'Không' ? (
                        <>Màu sắc: {item.colorName}<br /></>
                      ) : null}
                      {item.configurationName && item.configurationName !== 'Không' ? (
                        <>Cấu hình: {item.configurationName}</>
                      ) : null}
                    </div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString()} VNĐ</td>
                  <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">Tổng cộng</td>
                <td>{cartData.total.toLocaleString()} VNĐ</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <button onClick={handlePayment} className="payment-buttons">Xác nhận thanh toán</button>
    </div>
  );
}

export default Payment;
