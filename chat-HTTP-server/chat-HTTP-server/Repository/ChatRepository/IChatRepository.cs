using chat_HTTP_server.Model;

namespace chat_HTTP_server.Repository.ChatRepository;

public interface IChatRepository
{
    Task<int>? CreateChat(Chat chat);
}