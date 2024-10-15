using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using System.Collections.Generic;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoMoController : ControllerBase
    {
        private readonly MomoService _momoService;

        public MoMoController(MomoService momoService)
        {
            _momoService = momoService;
        }

        [HttpPost("PaymentMomo")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentRequestDTO paymentRequest)
        {
            var result = await _momoService.CreatePayment(paymentRequest.CreateOrderDTO, paymentRequest.OrderDetails);
            return Content(result);
        }
    }

    public class PaymentRequestDTO
    {
        public CreateOrderDTO CreateOrderDTO { get; set; }
        public List<CreateOrderDetailDTO> OrderDetails { get; set; }
    }
}
