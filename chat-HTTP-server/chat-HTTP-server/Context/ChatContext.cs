using chat_HTTP_server.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace chat_HTTP_server.Context;

public class ChatContext : IdentityDbContext<User>
{
    private DbSet<Message> Message;

    private DbSet<Chat> Chat;
    public ChatContext (DbContextOptions<ChatContext> options)
        : base(options)
    {
    }
}