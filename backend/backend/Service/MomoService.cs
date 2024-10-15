using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using backend.Model;
using backend.Data;
using backend.DTOs;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SendEmail.Service;

namespace backend.Services
{
    public class MomoService
    {
        private const string Endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        private const string PartnerCode = "MOMO5RGX20191128";
        private const string AccessKey = "M8brj9K6E22vXoDB";
        private const string SecretKey = "nqQiVSgDMy809JoPF6OzP5OdBUB550Y4";
        private const string RedirectUrl = "http://localhost:3000/profile";
        private const string NotifyUrl = "http://localhost:3000/thongbao";

        private readonly DataContext _context;
        private readonly EmailService _emailService;

        public MomoService(DataContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<string> CreatePayment(CreateOrderDTO createOrderDTO, List<CreateOrderDetailDTO> orderDetails)
        {
            // Tạo orderId và requestId
            string orderId = Guid.NewGuid().ToString();
            string requestId = Guid.NewGuid().ToString();

            // Tạo chuỗi Raw Hash và chữ ký
            string rawHash = $"accessKey={AccessKey}&amount={createOrderDTO.TotalPrice}&extraData=&ipnUrl={NotifyUrl}&orderId={orderId}&orderInfo={createOrderDTO.Note}&partnerCode={PartnerCode}&redirectUrl={RedirectUrl}&requestId={requestId}&requestType=captureWallet";
            string signature = CreateSignature(rawHash, SecretKey);

            JObject message = new JObject
    {
        { "partnerCode", PartnerCode },
        { "partnerName", "Test" },
        { "storeId", "MomoTestStore" },
        { "requestId", requestId },
        { "amount", createOrderDTO.TotalPrice },
        { "orderId", orderId },
        { "orderInfo", createOrderDTO.Note },
        { "redirectUrl", RedirectUrl },
        { "ipnUrl", NotifyUrl },
        { "lang", "en" },
        { "extraData", "" },
        { "requestType", "captureWallet" },
        { "signature", signature }
    };

            // Mapping CreateOrderDTO sang Order
            var order = new Order
            {
                UserId = createOrderDTO.UserId,
                Name = createOrderDTO.Name,
                Note = createOrderDTO.Note,
                ShippingAddress = createOrderDTO.ShippingAddress,
                TotalPrice = createOrderDTO.TotalPrice,
                PaymentMethod = "MoMo",
                Status = OrderStatus.Paid,
                CreatedAt = DateTime.Now,
            };

            // Lưu Order vào cơ sở dữ liệu
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Gọi OrderDetailService để thêm OrderDetail
            foreach (var detail in orderDetails)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = order.Id, // Sử dụng order.Id sau khi đã lưu vào DB
                    ProductVariantId = detail.ProductVariantId,
                    Quantity = detail.Quantity,
                    Price = detail.Price
                };

                _context.OrderDetails.Add(orderDetail);
            }
            await _context.SaveChangesAsync();

            // Gửi email thông báo
            await SendOrderConfirmationEmail(order, orderDetails, RedirectUrl);
            // Gửi yêu cầu đến MoMo API
            using (var client = new HttpClient())
            {
                var response = await client.PostAsync(Endpoint, new StringContent(message.ToString(), Encoding.UTF8, "application/json"));
                return await response.Content.ReadAsStringAsync();
            }
        }

        // Tạo chữ ký
        private string CreateSignature(string rawHash, string secretKey)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey)))
            {
                var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawHash));
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
        private async Task SendOrderConfirmationEmail(Order order, List<CreateOrderDetailDTO> orderDetails, string baseUrl)
        {
            Console.WriteLine("Đang gửi email xác nhận đơn hàng...");

            var orderInfo = new StringBuilder();
            orderInfo.AppendLine("<ul style='list-style-type:none; padding:0; margin:0;'>");

            foreach (var detail in orderDetails)
            {
                var productVariant = await _context.ProductVariants
                    .Include(pv => pv.Product)
                    .FirstOrDefaultAsync(pv => pv.Id == detail.ProductVariantId);

                var imageUrl = "https://www.tncstore.vn/media/product/4250-logitech-g102-lightsync.png";
                if (productVariant != null)
                {
                    orderInfo.AppendLine("<li style='margin-bottom:20px; padding:10px; border:1px solid #ddd; border-radius:5px; display: flex; align-items: center;'>");
                    orderInfo.AppendLine($"<img src='{imageUrl}' alt='{productVariant.Product.Name}' style='max-width:100px; height:auto; border-radius:5px; margin-right:15px;' />");
                    orderInfo.AppendLine("<div style='flex: 1;'>");
                    orderInfo.AppendLine($"<strong style='color:#333;'>Tên sản phẩm:</strong> {productVariant.Product.Name}<br />");
                    orderInfo.AppendLine($"<strong style='color:#333;'>Số lượng:</strong> {detail.Quantity}<br />");
                    orderInfo.AppendLine($"<strong style='color:#333;'>Giá tiền:</strong> {detail.Price:C}<br />");
                    orderInfo.AppendLine("</div>");
                    orderInfo.AppendLine("</li>");
                }
                else
                {
                    orderInfo.AppendLine("<li style='margin-bottom:20px; padding:10px; border:1px solid #ddd; border-radius:5px;'>");
                    orderInfo.AppendLine($"<strong style='color:#d9534f;'>Sản phẩm với Product Variant ID: {detail.ProductVariantId} không tồn tại.</strong>");
                    orderInfo.AppendLine("</li>");
                }
            }

            orderInfo.AppendLine("</ul>");
            orderInfo.AppendLine($"<p style='font-weight:bold; font-size:16px; color:#333;'>Tổng cộng: {order.TotalPrice:C}</p>");

            string subject = "Xác nhận đơn hàng từ ThienCuong Store";
            string body = $@"
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; }}
        h1 {{ color: #333; text-align: center; }}
        ul {{ list-style-type: none; padding: 0; margin: 0; }}
        li {{ margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: #fafafa; }}
        strong {{ color: #333; }}
        p {{ font-weight: bold; font-size: 14px; color: #333; }}
        img {{ max-width: 100px; height: auto; border-radius: 5px; }}
        .footer {{ text-align: center; margin-top: 20px; font-size: 14px; color: #777; }}
    </style>
</head>
<body>
    <div class='container'>
        <h1>Đơn hàng của bạn đã được thanh toán thành công!</h1>
        <p>Cảm ơn bạn đã mua hàng tại ThienCuong Store. Dưới đây là thông tin đơn hàng của bạn:</p>
        {orderInfo}
        <p class='footer'>Chúng tôi sẽ gửi thông tin cập nhật về đơn hàng của bạn qua email này.<br>Trân trọng,<br>ThienCuong Store</p>
    </div>
</body>
</html>";

            string recipientEmail = "chauthiencuong123@gmail.com";

            try
            {
                await _emailService.SendEmailAsync(recipientEmail, subject, body);
                Console.WriteLine("Email đã được gửi thành công!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Có lỗi xảy ra khi gửi email: {ex.Message}");
            }
        }
    }
}
