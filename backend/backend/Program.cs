using backend.Data;
using Microsoft.EntityFrameworkCore;
using backend.Service;
using backend.Services;
using Microsoft.Extensions.FileProviders;
using System.IO;
using SendEmail.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<PromotionService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<OrderDetailService>();
builder.Services.AddScoped<MomoService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<IRevenueService, RevenueService>();


// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://localhost:3001")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

builder.Services.AddAutoMapper(typeof(MappingUser));
// Thêm dịch vụ HttpClientFactory
builder.Services.AddHttpClient();   
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static files from specific directories
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Banner")),
    RequestPath = "/uploads/banner"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Brand")),
    RequestPath = "/uploads/brand"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Category")),
    RequestPath = "/uploads/category"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Post")),
    RequestPath = "/uploads/post"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Gallery")),
    RequestPath = "/uploads/gallery"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User")),
    RequestPath = "/uploads/user"
});

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigins"); // Apply the CORS policy
app.UseAuthorization();
app.MapControllers();
app.Run();
