using chat_HTTP_server.Model;

namespace chat_HTTP_server.Repository;

public interface IUserRepository
{
    bool IsUsernameValid(string username);

    bool IsEmailValid(string email);

    List<User> GetUserByName(string name);
}