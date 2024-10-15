using backend.Data;
using backend.DTOs;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class CartService
    {
        private readonly DataContext _context;

        public CartService(DataContext context)
        {
            _context = context;
        }

        // Lấy giỏ hàng của người dùng theo UserId
        public async Task<CartDTO> GetCartByUserIdAsync(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.ProductVariant)
                        .ThenInclude(pv => pv.Product)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.ProductVariant)
                        .ThenInclude(pv => pv.Color)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.ProductVariant)
                        .ThenInclude(pv => pv.Configuration)
                .SingleOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return null;

            // Chuyển đổi từ Cart sang CartDTO
            var cartDto = new CartDTO
            {
                UserId = cart.UserId,
                CartItems = cart.CartItems.Select(ci => new CartItemDTO
                {
                    ProductVariantId = ci.ProductVariantId,
                    ProductName = ci.ProductVariant?.Product?.Name ?? "N/A",
                    ColorName = ci.ProductVariant?.Color?.Value ?? "Không",
                    ConfigurationName = ci.ProductVariant?.Configuration?.Value ?? "Không",
                    Quantity = ci.Quantity,
                    Price = ci.Price
                }).ToList()
            };

            return cartDto;
        }


        // Tính toán giá cho CartItem dựa trên khuyến mãi hoặc giá gốc
        private double GetPriceForCartItem(ProductVariant productVariant)
        {
            // Tìm khuyến mãi còn hiệu lực cho ProductVariant
            var activePromotion = productVariant.ProductPromotions
                .Where(pp => pp.IsActive)
                .OrderByDescending(pp => pp.Id) // Giả sử chọn khuyến mãi mới nhất
                .FirstOrDefault();

            // Trả về giá khuyến mãi nếu có, nếu không thì trả về giá gốc
            return activePromotion != null ? activePromotion.PriceSale : productVariant.Price;
        }

        // Thêm sản phẩm vào giỏ hàng
        public async Task AddToCartAsync(int userId, int productVariantId, int quantity)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CartItems = new List<CartItem>()
                };
                _context.Carts.Add(cart);
            }

            var existingCartItem = cart.CartItems
                .FirstOrDefault(ci => ci.ProductVariantId == productVariantId);

            var productVariant = await _context.ProductVariants
                .Include(pv => pv.ProductPromotions)
                .FirstOrDefaultAsync(pv => pv.Id == productVariantId);

            if (productVariant == null)
                throw new KeyNotFoundException("Sản phẩm không tồn tại.");

            int totalQuantityRequested = existingCartItem != null ? existingCartItem.Quantity + quantity : quantity;

            if (totalQuantityRequested > productVariant.Qty)
                throw new InvalidOperationException("Số lượng yêu cầu vượt quá số lượng hiện có trong kho.");

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += quantity;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductVariantId = productVariantId,
                    Quantity = quantity,
                    Price = GetPriceForCartItem(productVariant) // Sử dụng biến productVariant đã có để tính giá
                });
            }

            await _context.SaveChangesAsync();
        }
        public async Task UpdateCartItemAsync(int userId, int productVariantId, int newQuantity)
        {
            // Kiểm tra nếu số lượng mới là hợp lệ
            if (newQuantity <= 0)
                throw new ArgumentException("Số lượng sản phẩm phải lớn hơn 0.");

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                throw new KeyNotFoundException("Giỏ hàng không tồn tại.");

            var cartItem = cart.CartItems
                .FirstOrDefault(ci => ci.ProductVariantId == productVariantId);

            if (cartItem == null)
                throw new KeyNotFoundException("Sản phẩm không tồn tại trong giỏ hàng.");

            var productVariant = await _context.ProductVariants
                .Include(pv => pv.ProductPromotions)
                .FirstOrDefaultAsync(pv => pv.Id == productVariantId);

            if (productVariant == null)
                throw new KeyNotFoundException("Sản phẩm không tồn tại.");

            // Kiểm tra số lượng yêu cầu có vượt quá số lượng hiện có trong kho không
            if (newQuantity > productVariant.Qty)
                throw new InvalidOperationException("Số lượng yêu cầu vượt quá số lượng hiện có trong kho.");

            // Cập nhật số lượng và giá
            cartItem.Quantity = newQuantity;
            cartItem.Price = GetPriceForCartItem(productVariant); // Cập nhật giá dựa trên khuyến mãi

            await _context.SaveChangesAsync();
        }


        // Xóa sản phẩm khỏi giỏ hàng
        public async Task RemoveFromCartAsync(int userId, int productVariantId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                throw new KeyNotFoundException("Giỏ hàng không tồn tại.");

            var itemToRemove = cart.CartItems
                .FirstOrDefault(ci => ci.ProductVariantId == productVariantId);

            if (itemToRemove != null)
            {
                cart.CartItems.Remove(itemToRemove);
                await _context.SaveChangesAsync();
            }
        }

        // Xóa toàn bộ giỏ hàng của người dùng
        public async Task ClearCartAsync(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                throw new KeyNotFoundException("Giỏ hàng không tồn tại.");

            // Xóa tất cả các sản phẩm trong giỏ hàng
            _context.CartItems.RemoveRange(cart.CartItems);

            await _context.SaveChangesAsync();
        }
    }
}
