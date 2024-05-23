using chat_HTTP_server.Model;

namespace chat_HTTP_server.Repository;

public interface IUserRepository
{
    bool IsUsernameValid(string username);

    bool IsEmailValid(string email);

    Task<List<User>> GetUserByName(string name, string id);

    Task<List<User>> GetUserById(List<string> id);

    Task<User> GetUserById(string id);

    Task<List<ChatDto>> GetAllChatByUserId(string id);
}