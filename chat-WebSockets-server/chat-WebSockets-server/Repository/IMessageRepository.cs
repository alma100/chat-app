using chat_WebSockets_server.Model;

namespace chat_WebSockets_server.Repository;

public interface IMessageRepository
{
    void AddMessage(Message message);
}