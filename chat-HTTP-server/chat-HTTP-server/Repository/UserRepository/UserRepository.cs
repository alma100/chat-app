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

    public async Task<List<User>> GetUserByName(string name, string id)  //egyszer lekérni, tartalmazza-e a család és vezetékneve + id nem egyezik majd azt rendezni.
    {
        var splittedString = name.Split(" ", 2).ToList();
        
        var users = new List<User>();

        if (splittedString.Count == 1)
        {
            users = await _chatContext.Users.Where(x => x.FirstName.Contains(name) && x.Id != id).ToListAsync();
            users.AddRange( await _chatContext.Users.Where(x => x.LastName.Contains(name) && !x.FirstName.Contains(name) && x.Id != id).ToListAsync());
        }
        else
        {
            var lastName = splittedString[1];
            Console.WriteLine(lastName);

            users.AddRange(await _chatContext.Users.Where(x => x.FirstName == splittedString[0] && x.LastName == lastName && x.Id != id).ToListAsync());
            users.AddRange(await _chatContext.Users.Where(x => x.FirstName == splittedString[0] &&
                                                         x.LastName != lastName && x.LastName.Contains(lastName) &&
                                                         x.Id != id).ToListAsync());
            
        }

        return users;
    }

    public async Task<List<User>> GetUserById(List<string> ids)
    {
        return await _chatContext.Users
            .Where(x => ids.Contains(x.Id))
            .ToListAsync();
    }
    
    public async Task<User> GetUserById(string id)
    {

        var res = await _chatContext.Users.FirstOrDefaultAsync(u => u.Id == id);

        return res;
    }
    
    public async Task<List<ChatDto>> GetAllChatByUserId(string id)
    {
        
        var userChats = await _chatContext.Chat.Include(c => c.Users).Where(x => x.Users.Any(u => u.Id == id)).ToListAsync();

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