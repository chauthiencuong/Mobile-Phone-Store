import React from 'react';
import '../assets/css/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>Liên hệ</h4>
                    <p><strong>Địa chỉ:</strong> 69 Đỗ Xuân Hợp, Thành phố Thủ Đức</p>
                    <p><strong>Điện thoại:</strong> 0948770702</p>
                    <p><strong>Email:</strong> chauthiencuong123@gmail.com</p>
                </div>

                <div className="footer-section">
                    <h4>Liên kết nhanh</h4>
                    <ul>
                        <li><a href="/home">Trang chủ</a></li>
                        <li><a href="/products">Sản phẩm</a></li>
                        <li><a href="/about">Giới thiệu</a></li>
                        <li><a href="/contact">Liên hệ</a></li>
                        <li><a href="/warranty">Chính sách bảo hành</a></li>
                        <li><a href="/return-policy">Chính sách đổi trả</a></li>
                        <li><a href="/privacy-policy">Chính sách bảo mật</a></li>
                        <li><a href="/terms-of-service">Điều khoản dịch vụ</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Thông tin công ty</h4>
                    <p>Chúng tôi cung cấp các sản phẩm chất lượng với giá cả hợp lý. Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào!</p>
                </div>

                <div className="footer-section map">
                    <h4>Vị trí của chúng tôi</h4>
                    <div className="map-container">
                        <iframe
                            title="Google Maps Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.895697989945!2d106.63604861454733!3d10.756036262335831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b4d2f5a5d9d%3A0x85ecf4cf4e07a8f0!2sCity%20Hall!5e0!3m2!1sen!2s!4v1632937432642!5m2!1sen!2s"
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Công ty ThienCuong Store. Bảo lưu mọi quyền.</p>
            </div>
        </footer>
    );
}

export default Footer;
