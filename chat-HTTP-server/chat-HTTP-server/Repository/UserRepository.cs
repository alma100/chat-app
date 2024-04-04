using chat_HTTP_server.Context;

namespace chat_HTTP_server.Repository;

public class UserRepository : IUserRepository
{
    private readonly ChatContext _chatContext;

    public UserRepository(ChatContext chatContext)
    {
        _chatContext = chatContext;
    }

    public bool IsUsernameValid(string username)
    {
        return _chatContext.Users.Where(u => u.UserName == username).ToList().Count < 1;
    }

    public bool IsEmailValid(string email)
    {
        return _chatContext.Users.Where(u => u.Email == email).ToList().Count < 1;
    }
}