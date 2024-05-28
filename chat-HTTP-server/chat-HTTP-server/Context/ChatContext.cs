using chat_HTTP_server.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace chat_HTTP_server.Context;

public class ChatContext : IdentityDbContext<User>
{
    public DbSet<Emoji> Emoji { get; set; }
    
    public DbSet<Message> Message { get; set; }
    
    public DbSet<LogModel> Log { get; set; }
    public DbSet<Chat> Chat { get; set; }
    public ChatContext (DbContextOptions<ChatContext> options)
        : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Message>()
            .HasIndex(m => m.CreatedAt)
            .HasName("IX_Message_CreatedAt");

        modelBuilder.Entity<Message>()
            .HasIndex(m => m.ChatId)
            .HasName("IX_Message_ChatId");
    }
}