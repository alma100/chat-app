using chat_HTTP_server.Model;

namespace chat_HTTP_server.Repository;

public interface IUserRepository
{
    bool IsUsernameValid(string username);

    bool IsEmailValid(string email);

    List<User> GetUserByName(string name, string id);

    List<User> GetUserById(List<string> id);

    Task<User> GetUserById(string id);
    
    List<ChatDto> GetAllChatByUserId(string id);
}