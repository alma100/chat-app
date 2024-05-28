using chat_WebSockets_server.Context;
using chat_WebSockets_server.Model;
using Microsoft.EntityFrameworkCore;

namespace chat_WebSockets_server.Repository;

public class MessageRepository : IMessageRepository
{
    private ChatContext _chatContext;
    
    private IConfiguration _configuration;

    public MessageRepository(ChatContext chatContext, IConfiguration configuration)
    {
        _chatContext = chatContext;
        _configuration = configuration;
    }

    public async Task<Message> AddMessage(Message message)
    {
        message.CreatedAt = DateTime.Now;
        
        await _chatContext.Message.AddAsync(message);
        
        await _chatContext.SaveChangesAsync();
        
        return message;
    }

    public async Task<Message> UpdateMessageEmoji(Message message)
    {
        var oldMessageObj = _chatContext.Message
            .Include(m => m.Emoji) 
            .FirstOrDefault(m => m.MessageId == message.MessageId);
        
        oldMessageObj.Emoji = message.Emoji;
        
        await _chatContext.SaveChangesAsync();
        
        return oldMessageObj;
    }
    
    public async Task<Dictionary<int, List<Message>>> GetMessageByChatId(int chatId, int nextIndex)
    {
        var indexRange = Int32.Parse(_configuration["MessageIndex:InitialIndex"]);
        
        var messagesByChatId = await _chatContext.Chat
            .Where(c => c.Id == chatId)
            .SelectMany(c => c.Messages)
            .Include(m => m.Emoji)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
        
        var skipValue = messagesByChatId.Count - nextIndex;
        
        var result = new List<Message>();
        
        if (skipValue < 0)
        {
            result = messagesByChatId.Take(indexRange+skipValue).ToList();
        }
        else
        {
            result = messagesByChatId.Skip(skipValue).Take(indexRange).ToList();
        }
        
        return new Dictionary<int, List<Message>> { { chatId, result }};
    }
}