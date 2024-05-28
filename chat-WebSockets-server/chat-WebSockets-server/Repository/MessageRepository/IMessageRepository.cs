using chat_WebSockets_server.Model;

namespace chat_WebSockets_server.Repository;

public interface IMessageRepository
{
    Task<Message> AddMessage(Message message);

    Task<Message> UpdateMessageEmoji(Message message);
    
    Task<Dictionary<int, List<Message>>> GetMessageByChatId(int chatId, int nextIndex);
}