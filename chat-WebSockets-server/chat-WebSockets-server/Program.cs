using chat_WebSockets_server.Context;
using chat_WebSockets_server.Repository;
using chat_WebSockets_server.Service;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

AddDbContext();
AddServie();
var app = builder.Build();
app.UseWebSockets();

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
    builder.Services.AddScoped<IMessageRepository, MessageRepository>();
}

#endregion