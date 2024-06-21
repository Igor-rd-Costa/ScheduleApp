using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Context;
using Microsoft.AspNetCore.Identity;
using ScheduleAppBackend.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using ScheduleAppBackend.Services.Interfaces;
using ScheduleAppBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<ScheduleAppContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Database") ?? throw new InvalidOperationException("Connection string 'Database' not found.")
    );
});
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddIdentityCore<User>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
})
    .AddUserStore<UserStore>()
    .AddSignInManager<SignInManager<User>>();

var auth = builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
    options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
    options.DefaultSignOutScheme = IdentityConstants.ApplicationScheme;
    options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
});

auth.AddCookie(IdentityConstants.ApplicationScheme, options =>
{
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
  
    options.Events.OnRedirectToLogin = (context) =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = (context) =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
});

//auth.AddCookie(IdentityConstants.ExternalScheme, options =>
//{
//    options.Cookie.SameSite = SameSiteMode.None;
//    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
//    options.ExpireTimeSpan = TimeSpan.FromMinutes(120);
//    options.Events.OnRedirectToLogin = (context) =>
//    {
//        context.Response.StatusCode = 401;
//        return Task.CompletedTask;
//    };
//    options.Events.OnRedirectToAccessDenied = (context) =>
//    {
//        context.Response.StatusCode = 401;
//        return Task.CompletedTask;
//    };
//});
//auth.AddCookie(IdentityConstants.TwoFactorUserIdScheme, options =>
//{
//    options.Cookie.SameSite = SameSiteMode.None;
//    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
//    options.ExpireTimeSpan = TimeSpan.FromMinutes(120);
//    options.Events.OnRedirectToLogin = (context) =>
//    {
//        context.Response.StatusCode = 401;
//        return Task.CompletedTask;
//    };
//    options.Events.OnRedirectToAccessDenied = (context) =>
//    {
//        context.Response.StatusCode = 401;
//        return Task.CompletedTask;
//    };
//});

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", policyOptions =>
    {
        policyOptions.WithOrigins("http://localhost:4200")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors("Development");

app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();

app.Run();
