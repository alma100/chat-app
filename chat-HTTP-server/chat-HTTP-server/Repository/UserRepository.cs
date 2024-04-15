using chat_HTTP_server.Context;
using chat_HTTP_server.Model;

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

    public List<User> GetUserByName(string name)
    {
        
        var splittedString = name.Split(" ").ToList();
        
        var users = new List<User>();

        if (splittedString.Count == 1)
        {
            users = _chatContext.Users.Where(x => x.FirstName.Contains(name) ||  x.LastName.Contains(name)).ToList();
        }
        else
        {
            for (int i = 0; i < splittedString.Count; i++)
            {
                if (i == 0)
                {
                    users.AddRange(_chatContext.Users.Where(x => x.FirstName.Contains(name[i])).ToList());
                }
                else
                {
                    users.AddRange(_chatContext.Users.Where(x => x.LastName.Contains(name[i])).ToList());
                }
            }
        }

        return users;
    }
}