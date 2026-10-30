using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using SUSS_Booking_System.Repositories;
using SUSS_Booking_System.services;
using SUSS_Booking_System.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Keep only AddControllers() since this is a clean Web API project
builder.Services.AddControllers();

// 2. Set up authentication backed by Microsoft Identity
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// Map the token "roles" claim array directly to .NET User.IsInRole() matching
builder.Services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.TokenValidationParameters.RoleClaimType = "roles";
});

builder.Services.AddAuthorization();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("SUSSBookingDB")
    )
);

builder.Services.AddScoped<IFormD1Repository, FormD1Repository>();
builder.Services.AddScoped<IFormD1Service, FormD1Service>();

// Add CORS policy to allow requests from the React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();

// Execution sequence matters here - Keep this exact middleware order!
app.UseCors("ReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
