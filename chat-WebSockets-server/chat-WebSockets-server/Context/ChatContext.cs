﻿using chat_WebSockets_server.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace chat_WebSockets_server.Context;

public class ChatContext : IdentityDbContext<User>
{
    public DbSet<Message> Message { get; set; }

    public DbSet<Chat> Chat { get; set; }
    
    public ChatContext (DbContextOptions<ChatContext> options)
        : base(options)
    {
    }
}