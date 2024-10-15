using backend.Data;
using backend.DTOs;
using backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Unidecode.NET;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly DataContext _context;

        public ProductController(DataContext context)
        {
            _context = context;
        }

        private string GenerateSlug(string name)
        {
            string slug = name.Unidecode().ToLowerInvariant();
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-").Trim('-');
            return slug;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Galleries)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Color)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Configuration)
                .ToListAsync();

            var productDtos = products.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Sku = p.Sku,
                Description = p.Description,
                CategoryId = p.CategoryId,
                Category = new CategoryDTO
                {
                    Id = p.Category.Id,
                    Name = p.Category.Name
                },
                BrandId = p.BrandId,
                Brand = new BrandDTO
                {
                    Id = p.Brand.Id,
                    Name = p.Brand.Name
                },
                Status = p.Status,
                CreatedAt = p.CreatedAt,
                IsVariant = p.IsVariant,
                Galleries = p.Galleries.Select(g => new GalleryDTO
                {
                    Id = g.Id,
                    ProductId = g.ProductId,
                    ImageGallery = $"{Request.Scheme}://{Request.Host}/{g.ImageGallery.Replace("\\", "/")}"
                }).ToList(),
                ProductVariants = p.ProductVariants.Select(pv => new ProductVariantDTO
                {
                    Id = pv.Id,
                    ProductId = pv.ProductId,
                    ColorId = pv.ColorId,
                    Color = pv.Color != null ? new ColorDTO
                    {
                        Id = pv.Color.Id,
                        Value = pv.Color.Value
                    } : null,
                    ConfigurationId = pv.ConfigurationId,
                    Configuration = pv.Configuration != null ? new ConfigurationDTO
                    {
                        Id = pv.Configuration.Id,
                        Value = pv.Configuration.Value
                    } : null,
                    Price = pv.Price,
                    Qty = pv.Qty
                }).ToList(),
                // Bỏ qua ProductPromotions
            }).ToList();

            return Ok(productDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Galleries)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Color)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Configuration)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            var productDto = new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Slug = product.Slug,
                Sku = product.Sku,
                Description = product.Description,
                CategoryId = product.CategoryId,
                Category = new CategoryDTO
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name
                },
                BrandId = product.BrandId,
                Brand = new BrandDTO
                {
                    Id = product.Brand.Id,
                    Name = product.Brand.Name
                },
                Status = product.Status,
                IsVariant = product.IsVariant,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                CreatedBy = product.CreatedBy,
                UpdatedBy = product.UpdatedBy,
                Galleries = product.Galleries.Select(g => new GalleryDTO
                {
                    Id = g.Id,
                    ProductId = g.ProductId,
                    ImageGallery = $"{Request.Scheme}://{Request.Host}/{g.ImageGallery.Replace("\\", "/")}"
                }).ToList(),
                ProductVariants = product.ProductVariants.Select(pv => new ProductVariantDTO
                {
                    Id = pv.Id,
                    ProductId = pv.ProductId,
                    ColorId = pv.ColorId,
                    Color = pv.Color != null ? new ColorDTO
                    {
                        Id = pv.Color.Id,
                        Value = pv.Color.Value
                    } : null,
                    ConfigurationId = pv.ConfigurationId,
                    Configuration = pv.Configuration != null ? new ConfigurationDTO
                    {
                        Id = pv.Configuration.Id,
                        Value = pv.Configuration.Value
                    } : null,
                    Price = pv.Price,
                    Qty = pv.Qty
                }).ToList(),
                // Bỏ qua ProductPromotions
            };

            return Ok(productDto);
        }

        [HttpGet("chi-tiet-san-pham/{slug}")]
        public async Task<ActionResult<ProductDTO>> GetProductBySlug(string slug)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Galleries)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Color)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Configuration)
                .FirstOrDefaultAsync(p => p.Slug == slug);

            if (product == null)
            {
                return NotFound();
            }

            var productDto = new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Slug = product.Slug,
                Sku = product.Sku,
                Description = product.Description,
                CategoryId = product.CategoryId,
                Category = new CategoryDTO
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name
                },
                BrandId = product.BrandId,
                Brand = new BrandDTO
                {
                    Id = product.Brand.Id,
                    Name = product.Brand.Name
                },
                Status = product.Status,
                IsVariant = product.IsVariant,
                Galleries = product.Galleries.Select(g => new GalleryDTO
                {
                    Id = g.Id,
                    ProductId = g.ProductId,
                    ImageGallery = $"{Request.Scheme}://{Request.Host}/{g.ImageGallery.Replace("\\", "/")}"
                }).ToList(),
                ProductVariants = product.ProductVariants.Select(pv => new ProductVariantDTO
                {
                    Id = pv.Id,
                    ProductId = pv.ProductId,
                    ColorId = pv.ColorId,
                    Color = pv.Color != null ? new ColorDTO
                    {
                        Id = pv.Color.Id,
                        Value = pv.Color.Value
                    } : null,
                    ConfigurationId = pv.ConfigurationId,
                    Configuration = pv.Configuration != null ? new ConfigurationDTO
                    {
                        Id = pv.Configuration.Id,
                        Value = pv.Configuration.Value
                    } : null,
                    Price = pv.Price,
                    Qty = pv.Qty
                }).ToList(),
                // Bỏ qua ProductPromotions
            };

            return Ok(productDto);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDTO>> CreateProduct(CreateProductDTO createProductDto)
        {
            // Tạo slug từ tên sản phẩm
            string slug = GenerateSlug(createProductDto.Name);

            var product = new Product
            {
                Name = createProductDto.Name,
                Slug = slug,
                Description = createProductDto.Description,
                CategoryId = createProductDto.CategoryId,
                BrandId = createProductDto.BrandId,
                Sku = createProductDto.Sku,
                Status = createProductDto.Status,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = 1,
                UpdatedBy = 1,
                IsVariant = createProductDto.IsVariant
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var productDto = new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Slug = product.Slug,
                Sku = product.Sku,
                Description = product.Description,
                CategoryId = product.CategoryId,
                BrandId = product.BrandId,
                Status = product.Status,
                CreatedAt = product.CreatedAt,
                IsVariant = product.IsVariant
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDTO updateProductDto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            product.Name = updateProductDto.Name;
            product.Description = updateProductDto.Description;
            product.CategoryId = updateProductDto.CategoryId;
            product.BrandId = updateProductDto.BrandId;
            product.Sku = updateProductDto.Sku;
            product.Status = updateProductDto.Status;
            product.IsVariant = updateProductDto.IsVariant;
            product.UpdatedAt = DateTime.UtcNow;

            // Cập nhật lại slug nếu tên sản phẩm thay đổi
            product.Slug = GenerateSlug(updateProductDto.Name);

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("ProductBrand/{brandSlug}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsByBrandSlug(string brandSlug)
        {
            // Tìm brand dựa trên slug
            var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Slug == brandSlug);

            if (brand == null)
            {
                return NotFound(new { message = "Brand not found" });
            }

            // Lấy danh sách sản phẩm dựa trên BrandId
            var products = await _context.Products
                .Where(p => p.BrandId == brand.Id)
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Galleries)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Color)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Configuration)
                .ToListAsync();

            // Chuyển đổi sang DTO
            var productDtos = products.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Sku = p.Sku,
                Description = p.Description,
                CategoryId = p.CategoryId,
                Category = new CategoryDTO
                {
                    Id = p.Category.Id,
                    Name = p.Category.Name
                },
                BrandId = p.BrandId,
                Brand = new BrandDTO
                {
                    Id = p.Brand.Id,
                    Name = p.Brand.Name
                },
                Status = p.Status,
                CreatedAt = p.CreatedAt,
                IsVariant = p.IsVariant,
                Galleries = p.Galleries.Select(g => new GalleryDTO
                {
                    Id = g.Id,
                    ProductId = g.ProductId,
                    ImageGallery = $"{Request.Scheme}://{Request.Host}/{g.ImageGallery.Replace("\\", "/")}"
                }).ToList(),
                ProductVariants = p.ProductVariants.Select(pv => new ProductVariantDTO
                {
                    Id = pv.Id,
                    ProductId = pv.ProductId,
                    ColorId = pv.ColorId,
                    Color = pv.Color != null ? new ColorDTO
                    {
                        Id = pv.Color.Id,
                        Value = pv.Color.Value
                    } : null,
                    ConfigurationId = pv.ConfigurationId,
                    Configuration = pv.Configuration != null ? new ConfigurationDTO
                    {
                        Id = pv.Configuration.Id,
                        Value = pv.Configuration.Value
                    } : null,
                    Price = pv.Price,
                    Qty = pv.Qty
                }).ToList(),
            }).ToList();

            return Ok(productDtos);
        }

        [HttpGet("ProductCategory")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsByCategory(
        [FromQuery] string categorySlug,
        [FromQuery] string? brandSlug = null,
        [FromQuery] int? colorId = null,
        [FromQuery] int? configurationId = null)
        {
            // Tìm Category dựa trên slug
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Slug == categorySlug);

            if (category == null)
            {
                return NotFound("Category not found");
            }

            // Bắt đầu truy vấn sản phẩm với categoryId
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Galleries)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Color)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Configuration)
                .Where(p => p.CategoryId == category.Id);

            // Nếu có brandSlug, tìm Brand và lọc sản phẩm theo brandId
            if (!string.IsNullOrEmpty(brandSlug))
            {
                var brand = await _context.Brands
                    .FirstOrDefaultAsync(b => b.Slug == brandSlug);

                if (brand == null)
                {
                    return NotFound("Brand not found");
                }

                query = query.Where(p => p.BrandId == brand.Id);
            }

            // Lọc theo colorId và configurationId nếu có
            if (colorId.HasValue && configurationId.HasValue)
            {
                // Lọc sản phẩm có ít nhất một biến thể với colorId và configurationId
                query = query.Where(p => p.ProductVariants
                    .Any(pv => pv.ColorId == colorId.Value && pv.ConfigurationId == configurationId.Value));
            }
            else if (colorId.HasValue)
            {
                // Lọc sản phẩm có ít nhất một biến thể với colorId
                query = query.Where(p => p.ProductVariants
                    .Any(pv => pv.ColorId == colorId.Value));
            }
            else if (configurationId.HasValue)
            {
                // Lọc sản phẩm có ít nhất một biến thể với configurationId
                query = query.Where(p => p.ProductVariants
                    .Any(pv => pv.ConfigurationId == configurationId.Value));
            }

            var products = await query.ToListAsync();

            var productDtos = products.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Sku = p.Sku,
                Description = p.Description,
                CategoryId = p.CategoryId,
                Category = new CategoryDTO
                {
                    Id = p.Category.Id,
                    Name = p.Category.Name
                },
                BrandId = p.BrandId,
                Brand = new BrandDTO
                {
                    Id = p.Brand.Id,
                    Name = p.Brand.Name
                },
                Status = p.Status,
                CreatedAt = p.CreatedAt,
                IsVariant = p.IsVariant,
                Galleries = p.Galleries.Select(g => new GalleryDTO
                {
                    Id = g.Id,
                    ProductId = g.ProductId,
                    ImageGallery = $"{Request.Scheme}://{Request.Host}/{g.ImageGallery.Replace("\\", "/")}"
                }).ToList(),
                ProductVariants = p.ProductVariants.Select(pv => new ProductVariantDTO
                {
                    Id = pv.Id,
                    ProductId = pv.ProductId,
                    ColorId = pv.ColorId,
                    Color = pv.Color != null ? new ColorDTO
                    {
                        Id = pv.Color.Id,
                        Value = pv.Color.Value
                    } : null,
                    ConfigurationId = pv.ConfigurationId,
                    Configuration = pv.Configuration != null ? new ConfigurationDTO
                    {
                        Id = pv.Configuration.Id,
                        Value = pv.Configuration.Value
                    } : null,
                    Price = pv.Price,
                    Qty = pv.Qty
                }).ToList(),
            }).ToList();

            return Ok(productDtos);
        }
    }
}
