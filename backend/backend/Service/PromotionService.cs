using backend.Data;
using backend.DTOs;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Service
{
    public class PromotionService
    {
        private readonly DataContext _context;

        public PromotionService(DataContext context)
        {
            _context = context;
        }

        // Thêm khuyến mãi mới vào cơ sở dữ liệu
        public async Task AddPromotionAsync(Promotion promotion)
        {
            // Đặt trạng thái IsActive dựa trên ngày kết thúc khuyến mãi
            promotion.IsActive = promotion.EndDate >= DateTime.Now;

            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();
        }

        // Lấy danh sách tất cả các khuyến mãi
        public async Task<IEnumerable<Promotion>> GetAllPromotionsAsync()
        {
            return await _context.Promotions.ToListAsync();
        }

        // Lấy khuyến mãi theo Id
        public async Task<Promotion?> GetPromotionByIdAsync(int id)
        {
            return await _context.Promotions
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        // Cập nhật khuyến mãi
        public async Task UpdatePromotionAsync(Promotion updatedPromotion)
        {
            var promotion = await _context.Promotions
                .FirstOrDefaultAsync(p => p.Id == updatedPromotion.Id);

            if (promotion == null)
            {
                throw new InvalidOperationException("Khuyến mãi không tồn tại.");
            }

            // Cập nhật thông tin khuyến mãi
            promotion.Name = updatedPromotion.Name;
            promotion.Description = updatedPromotion.Description;
            promotion.Discount = updatedPromotion.Discount;
            promotion.StartDate = updatedPromotion.StartDate;
            promotion.EndDate = updatedPromotion.EndDate;

            // Đặt trạng thái IsActive dựa trên endDate
            promotion.IsActive = promotion.EndDate >= DateTime.Now;

            _context.Promotions.Update(promotion);
            await _context.SaveChangesAsync();

            // Cập nhật trạng thái và giá bán của ProductPromotion liên quan
            var productPromotions = await _context.ProductPromotions
                .Where(pp => pp.PromotionId == updatedPromotion.Id)
                .Include(pp => pp.ProductVariant) // Include biến thể sản phẩm để tính giá bán
                .ToListAsync();

            // Xóa các khuyến mãi hiện có của sản phẩm
            _context.ProductPromotions.RemoveRange(productPromotions);

            // Cập nhật giá bán của các sản phẩm liên quan
            foreach (var productPromotion in productPromotions)
            {
                var productVariant = productPromotion.ProductVariant;
                // Kiểm tra nếu khuyến mãi còn hiệu lực
                bool isPromotionActive = promotion.IsActive && promotion.EndDate >= DateTime.Now;

                // Tính giá bán sau khi áp dụng khuyến mãi
                double discount = promotion.Discount / 100.0;
                double priceSale = isPromotionActive
                    ? productVariant.Price - (productVariant.Price * discount)
                    : productVariant.Price;

                productPromotion.PriceSale = priceSale;
                productPromotion.IsActive = isPromotionActive;

                _context.ProductPromotions.Add(productPromotion);
            }

            await _context.SaveChangesAsync();
        }

        public async Task ApplyPromotionAsync(int productVariantId, int promotionId)
        {
            // Lấy khuyến mãi theo ID
            var promotion = await _context.Promotions
                .FirstOrDefaultAsync(p => p.Id == promotionId);

            if (promotion == null)
            {
                throw new InvalidOperationException("Khuyến mãi không tồn tại.");
            }

            // Cập nhật trạng thái IsActive nếu khuyến mãi đã hết hạn
            if (promotion.EndDate < DateTime.Now)
            {
                promotion.IsActive = false;
                _context.Promotions.Update(promotion);
                await _context.SaveChangesAsync();
            }

            // Lấy biến thể sản phẩm theo productVariantId
            var productVariant = await _context.ProductVariants
                .FirstOrDefaultAsync(pv => pv.Id == productVariantId);

            if (productVariant == null)
            {
                throw new InvalidOperationException("Không tìm thấy biến thể sản phẩm.");
            }

            // Xóa các khuyến mãi hiện có của biến thể sản phẩm này
            var existingProductPromotions = await _context.ProductPromotions
                .Where(pp => pp.ProductVariantId == productVariantId && pp.PromotionId == promotionId)
                .ToListAsync();

            _context.ProductPromotions.RemoveRange(existingProductPromotions);

            // Kiểm tra trạng thái IsActive của khuyến mãi
            bool isPromotionActive = promotion.IsActive && promotion.EndDate >= DateTime.Now;

            // Tính giá bán sau khi áp dụng khuyến mãi
            double discount = promotion.Discount / 100.0;
            double priceSale = isPromotionActive
                ? productVariant.Price - (productVariant.Price * discount)
                : productVariant.Price;

            var productPromotion = new ProductPromotion
            {
                ProductVariantId = productVariantId,
                PromotionId = promotionId,
                PriceSale = priceSale,
                IsActive = isPromotionActive,
                ProductVariant = productVariant
            };

            _context.ProductPromotions.Add(productPromotion);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateProductVariantPriceAsync(int productId, double newPrice)
        {
            // Lấy tất cả các biến thể sản phẩm cho sản phẩm cụ thể
            var productVariants = await _context.ProductVariants
                .Where(pv => pv.ProductId == productId)
                .ToListAsync();

            foreach (var productVariant in productVariants)
            {
                productVariant.Price = newPrice;
                _context.ProductVariants.Update(productVariant);

                // Cập nhật khuyến mãi liên quan
                var productPromotions = await _context.ProductPromotions
                    .Where(pp => pp.ProductVariant.ProductId == productId)
                    .ToListAsync();

                foreach (var productPromotion in productPromotions)
                {
                    // Tính giá bán mới sau khi áp dụng khuyến mãi
                    bool isPromotionActive = productPromotion.IsActive &&
                                             productPromotion.Promotion.EndDate >= DateTime.Now;

                    double discount = productPromotion.Promotion.Discount / 100.0;
                    double priceSale = isPromotionActive
                        ? newPrice - (newPrice * discount)
                        : newPrice;

                    productPromotion.PriceSale = priceSale;
                    _context.ProductPromotions.Update(productPromotion);
                }
            }

            await _context.SaveChangesAsync();
        }
        public async Task DeletePromotionAsync(int id)
        {
            var promotion = await _context.Promotions
                .FirstOrDefaultAsync(p => p.Id == id);

            if (promotion == null)
            {
                throw new InvalidOperationException("Khuyến mãi không tồn tại.");
            }

            var productPromotions = await _context.ProductPromotions
                .Where(pp => pp.PromotionId == id)
                .ToListAsync();

            _context.ProductPromotions.RemoveRange(productPromotions);

            _context.Promotions.Remove(promotion);

            await _context.SaveChangesAsync();
        }
        // Lấy danh sách khuyến mãi của sản phẩm
        public async Task<IEnumerable<ProductPromotionDTO>> GetPromotionsByProductIdAsync(int productId)
        {
            return await _context.ProductPromotions
                .Where(pp => pp.ProductVariant.ProductId == productId)
                .Select(pp => new ProductPromotionDTO
                {
                    Id = pp.Id,
                    ProductVariantId = pp.ProductVariantId,
                    PromotionId = pp.PromotionId,
                    PriceSale = pp.PriceSale,
                    IsActive = pp.IsActive
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<ProductPromotionDTO>> GetAllProductPromotionsAsync()
        {
            return await _context.ProductPromotions
                .Include(pp => pp.Promotion)
                .Select(pp => new ProductPromotionDTO
                {
                    Id = pp.Id,
                    ProductVariantId = pp.ProductVariantId,
                    PromotionId = pp.PromotionId,
                    PriceSale = pp.PriceSale,
                    IsActive = pp.IsActive,
                    Promotion = new PromotionDTO
                    {
                        Discount = pp.Promotion.Discount,
                    }
                })
                .ToListAsync();
        }

    }
}
