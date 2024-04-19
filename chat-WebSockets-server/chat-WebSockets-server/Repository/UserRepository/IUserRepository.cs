

using chat_WebSockets_server.Model;

namespace chat_WebSockets_server.Repository.UserRepository;

public interface IUserRepository
{
    List<User> GetUserByChatId(int chatId);

    User? GetUserById(string id);


}