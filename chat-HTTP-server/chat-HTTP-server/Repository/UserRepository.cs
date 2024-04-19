using chat_HTTP_server.Context;
using chat_HTTP_server.Model;
using Microsoft.EntityFrameworkCore;

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

    public List<User> GetUserByName(string name, string id)
    {
        Console.WriteLine(name);
        var splittedString = name.Split(" ", 2).ToList();
        /*Console.WriteLine(splittedString[0]);
        Console.WriteLine(splittedString[1]);*/
        var users = new List<User>();

        if (splittedString.Count == 1)
        {
            users = _chatContext.Users.Where(x => x.FirstName.Contains(name) && x.Id != id).ToList();
            users.AddRange(_chatContext.Users.Where(x => x.LastName.Contains(name) && !x.FirstName.Contains(name) && x.Id != id).ToList());
        }
        else
        {
            var lastName = splittedString[1];
            Console.WriteLine(lastName);

            users.AddRange(_chatContext.Users.Where(x => x.FirstName == splittedString[0] && x.LastName == lastName && x.Id != id).ToList());
            users.AddRange(_chatContext.Users.Where(x => x.FirstName == splittedString[0] &&
                                                         x.LastName != lastName && x.LastName.Contains(lastName) &&
                                                         x.Id != id).ToList());
            
        }

        return users;
    }

    public List<User> GetUserById(List<string> ids)
    {
        var res = new List<User>();
        
        foreach (var id in ids)
        { 
            res.AddRange(_chatContext.Users.Where(x => x.Id == id).ToList());
        } 

        return res;
    }
    
    public List<ChatDto> GetAllChatByUserId(string id)
    {
        
        var userChats = _chatContext.Chat.Include(c => c.Users).Where(x => x.Users.Any(u => u.Id == id)).ToList();

        var result = new List<ChatDto>();

        foreach (var chat in userChats)
        {
            //var userId = chat.Users.Where(u => u.Id != id).Select(x => x.Id).ToList();
            var userFullName = chat.Users.Where(x => x.Id != id).Select(u => u.FirstName + " " + u.LastName).ToList();
            var newChatDto = new ChatDto
            {
                Id = chat.Id,
                UsersFullName = userFullName

            };
            result.Add(newChatDto);
        }
        return result;
    }
}