using chat_WebSockets_server.Model;

namespace chat_WebSockets_server.Repository;

public interface IMessageRepository
{
    Task<Message> AddMessage(Message message);

    Task<Message> UpdateMessageEmoji(Message message);

    Dictionary<int, List<Message>> GetMessageByUser(string userId, int nextIndex);

    Task<Dictionary<int, List<Message>>> GetMessageByChatId(int chatId, int nextIndex);
}