using chat_WebSockets_server.Context;
using chat_WebSockets_server.Model;
using Microsoft.EntityFrameworkCore;

namespace chat_WebSockets_server.Repository;

public class MessageRepository : IMessageRepository
{
    private ChatContext _chatContext;

    public MessageRepository(ChatContext chatContext)
    {
        _chatContext = chatContext;
    }

    public async Task<Message> AddMessage(Message message)
    {
        message.CreatedAt = DateTime.Now;
        await _chatContext.Message.AddAsync(message);
        await _chatContext.SaveChangesAsync();
        Console.WriteLine(message.MessageId);
        return message;
    }

    public async Task<Message> UpdateMessageEmoji(Message message)
    {
        Console.WriteLine("Update fv belépés");
        Console.WriteLine($"üzenet id:{message.MessageId}");
        var oldMessageObj = _chatContext.Message
            .Include(m => m.Emoji) 
            .FirstOrDefault(m => m.MessageId == message.MessageId);

        Console.WriteLine(oldMessageObj);
        oldMessageObj.Emoji = message.Emoji;
        await _chatContext.SaveChangesAsync();
        Console.WriteLine(oldMessageObj.Emoji.Count);
        return oldMessageObj;
    }
}