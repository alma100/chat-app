using chat_WebSockets_server.Context;
using chat_WebSockets_server.Model;

namespace chat_WebSockets_server.Repository;

public class MessageRepository : IMessageRepository
{
    private ChatContext _chatContext;

    public MessageRepository(ChatContext chatContext)
    {
        _chatContext = chatContext;
    }

    public async void AddMessage(Message message)
    {
        message.CreatedAt = DateTime.Now;
        await _chatContext.Message.AddAsync(message);
        await _chatContext.SaveChangesAsync();
    }
}