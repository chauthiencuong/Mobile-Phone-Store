using Microsoft.EntityFrameworkCore;
using backend.Model;
using Microsoft.AspNetCore.Identity;

namespace backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Banner> Banners { get; set; }
        public DbSet<Gallery> Galleries { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<ProductPromotion> ProductPromotions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Mã hóa mật khẩu trước khi thêm vào cơ sở dữ liệu
            var hasher = new PasswordHasher<User>();
            var adminUser = new User
            {
                Id = 1,
                Username = "admin",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                Email = "admin@gmail.com",
                Phone = "1234567890",
                Name = "admin",
                Role = "Admin"
            };
            // Thêm người dùng admin vào cơ sở dữ liệu
            modelBuilder.Entity<User>().HasData(adminUser);

            // Thiết lập mối quan hệ giữa Product và Category
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Thiết lập mối quan hệ giữa Product và Brand
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Brand)
                .WithMany(b => b.Products)
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Restrict);

            // Thiết lập mối quan hệ Product - ProductVariant
            modelBuilder.Entity<ProductVariant>()
                .HasOne(pv => pv.Product)
                .WithMany(p => p.ProductVariants)
                .HasForeignKey(pv => pv.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Thiết lập mối quan hệ Color - ProductVariant
            modelBuilder.Entity<ProductVariant>()
                .HasOne(pv => pv.Color)
                .WithMany(c => c.ProductVariants)
                .HasForeignKey(pv => pv.ColorId)
                .OnDelete(DeleteBehavior.SetNull);

            // Thiết lập mối quan hệ Configuration - ProductVariant
            modelBuilder.Entity<ProductVariant>()
                .HasOne(pv => pv.Configuration)
                .WithMany(c => c.ProductVariants)
                .HasForeignKey(pv => pv.ConfigurationId)
                .OnDelete(DeleteBehavior.SetNull);

            // Thiết lập mối quan hệ ProductPromotion - ProductVariant
            modelBuilder.Entity<ProductPromotion>()
                .HasOne(pp => pp.ProductVariant)
                .WithMany(pv => pv.ProductPromotions)
                .HasForeignKey(pp => pp.ProductVariantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Thiết lập mối quan hệ ProductPromotion - Promotion
            modelBuilder.Entity<ProductPromotion>()
                .HasOne(pp => pp.Promotion)
                .WithMany(p => p.ProductPromotions)
                .HasForeignKey(pp => pp.PromotionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Banner>()
                .HasOne(b => b.CreatedByUser)
                .WithMany()
                .HasForeignKey(b => b.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Banner>()
                .HasOne(b => b.UpdatedByUser)
                .WithMany()
                .HasForeignKey(b => b.UpdatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            //Brand
            modelBuilder.Entity<Brand>()
                .HasOne(b => b.CreatedByUser)
                .WithMany()
                .HasForeignKey(b => b.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Brand>()
                .HasOne(b => b.UpdatedByUser)
                .WithMany()
                .HasForeignKey(b => b.UpdatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            //Category
            modelBuilder.Entity<Category>()
                .HasOne(b => b.CreatedByUser)
                .WithMany()
                .HasForeignKey(b => b.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Category>()
                .HasOne(b => b.UpdatedByUser)
                .WithMany()
                .HasForeignKey(b => b.UpdatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            //Product
            modelBuilder.Entity<Product>()
                .HasOne(b => b.CreatedByUser)
                .WithMany()
                .HasForeignKey(b => b.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(b => b.UpdatedByUser)
                .WithMany()
                .HasForeignKey(b => b.UpdatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            //Review
            modelBuilder.Entity<Review>()
                .HasOne(u => u.Product)
                .WithMany(r => r.Reviews)
                .HasForeignKey(u => u.ProductId);

            modelBuilder.Entity<Review>()
                .HasOne(u => u.User)
                .WithMany(r => r.Reviews)
                .HasForeignKey(u => u.UserId);

            modelBuilder.Entity<Menu>()
                .HasOne(b => b.CreatedByUser)
                .WithMany()
                .HasForeignKey(b => b.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Menu>()
                .HasOne(b => b.UpdatedByUser)
                .WithMany()
                .HasForeignKey(b => b.UpdatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Post>()
               .HasOne(b => b.CreatedByUser)
               .WithMany()
               .HasForeignKey(b => b.CreatedBy)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Post>()
                .HasOne(b => b.UpdatedByUser)
                .WithMany()
                .HasForeignKey(b => b.UpdatedBy)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}
