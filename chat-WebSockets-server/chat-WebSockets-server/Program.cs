using System.Text;
using chat_WebSockets_server.Context;
using chat_WebSockets_server.Model;
using chat_WebSockets_server.Repository;
using chat_WebSockets_server.Repository.UserRepository;
using chat_WebSockets_server.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebSocketManager = chat_WebSockets_server.Service.WebSocketManager;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

builder.Services.AddEndpointsApiExplorer();


builder.Logging.ClearProviders();
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
builder.Logging.AddConsole();

AddDbContext();
AddServie();
AddAuthentication();
AddIdentity();
var app = builder.Build();
app.UseWebSockets();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();


#region AddDbContext()

void AddDbContext()
{
    builder.Services.AddDbContext<ChatContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("Chat") ?? throw new InvalidOperationException("Connection string 'Chat' not found.")));
}

#endregion

#region AddService

void AddServie()
{
    builder.Services.AddScoped<IChatService, ChatService>();
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IMessageRepository, MessageRepository>();
    builder.Services.AddSingleton<IWebSocketManager, WebSocketManager>();
}

#endregion

#region Authentication()

void AddAuthentication()
{
    builder.Services
        .AddAuthentication(options =>
        {
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ClockSkew = TimeSpan.Zero,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
                ),
            };

            options.Events = new JwtBearerEvents()
            {
                OnMessageReceived = contex =>
                {
                    contex.Token = contex.Request.Cookies["access_token"];
                    return Task.CompletedTask;
                }
            };

        });
}
        
#endregion


#region AddIdentity()

void AddIdentity()
{
    builder.Services
        .AddIdentityCore<User>(options =>
        {
            options.SignIn.RequireConfirmedAccount = false;
            options.User.RequireUniqueEmail = true;
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;

            options.Lockout.MaxFailedAccessAttempts = 3;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(1);
                    
        })
        .AddRoles<IdentityRole>() //Enable Identity roles 
        .AddEntityFrameworkStores<ChatContext>()
        .AddSignInManager<SignInManager<User>>();
}

#endregion