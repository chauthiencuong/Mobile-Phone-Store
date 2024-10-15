using System.Net.Mail;
using System.Net;

namespace SendEmail.Service
{
    public class EmailService
    {
        private const string SmtpServer = "smtp.gmail.com";
        private const int SmtpPort = 587;
        private const string SmtpUser = "chauthiencuong123@gmail.com";
        private const string SmtpPass = "rfuf tyej sezj kffb";

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var smtpClient = new SmtpClient(SmtpServer)
                {
                    Port = SmtpPort,
                    Credentials = new NetworkCredential(SmtpUser, SmtpPass),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(SmtpUser),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true,
                };

                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);

                Console.WriteLine("Email đã được gửi thành công!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Có lỗi xảy ra khi gửi email: {ex.Message}");
            }
        }
    }
}
