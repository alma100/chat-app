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

    public Dictionary<int, List<Message>> GetMessageByUser(string userId, int nextIndex)
    {
        var initialIndex = Int32.Parse(_configuration["MessageIndex:InitialIndex"]);

        var skipValue = nextIndex - initialIndex;

        var takeValue = nextIndex;
        
        var currentUser = _chatContext.Users.FirstOrDefault(u => u.Id == userId);

        var messagesByChatId = _chatContext.Chat
            .Where(c => c.Users.Contains(currentUser))
            .SelectMany(c => c.Messages)
            .Include(m => m.Emoji)
            .OrderBy(m => m.CreatedAt)
            .AsEnumerable()
            .GroupBy(m => m.ChatId)
            .ToDictionary(g => g.Key, g => g.Skip(skipValue)
                .Take(takeValue).ToList());

        return messagesByChatId;

    }

    public Dictionary<int, List<Message>> GetMessageByChatId(int chatId, int nextIndex)
    {
        var indexRange = Int32.Parse(_configuration["MessageIndex:InitialIndex"]);

        
        
        var messagesByChatId = _chatContext.Chat
            .Where(c => c.Id == chatId)
            .SelectMany(c => c.Messages)
            .Include(m => m.Emoji)
            .OrderBy(m => m.CreatedAt)
            .ToList();

        Console.WriteLine(messagesByChatId.Count);
        
        var skipValue = messagesByChatId.Count - nextIndex;

        Console.WriteLine(skipValue);
        
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