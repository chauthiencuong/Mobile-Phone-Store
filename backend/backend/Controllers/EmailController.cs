using Microsoft.AspNetCore.Mvc;
using SendEmail.Service;

namespace SendEmail.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailController()
        {
            _emailService = new EmailService();
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail()
        {
            string toEmail = "chauthiencuong123@gmail.com";
            string subject = "ThienCuong Store";
            string body = "<h1>Đơn hàng đã được thanh toán thành công!.</p>";

            await _emailService.SendEmailAsync(toEmail, subject, body);
            return Ok("Email sent successfully");
        }
    }

}
