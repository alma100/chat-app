using chat_WebSockets_server.Context;
using chat_WebSockets_server.Model;
using Microsoft.EntityFrameworkCore;

namespace chat_WebSockets_server.Repository.UserRepository;

public class UserRepository : IUserRepository
{
    private readonly ChatContext _chatContext;

    public UserRepository(ChatContext chatContext)
    {
        _chatContext = chatContext;
    }

    public List<User> GetUserByChatId(int? chatId)
    {
        var usersInChat = _chatContext.Users.Where(u => u.Chats.Any(c => c.Id == chatId)).ToList();
        
        return usersInChat;
    }

    public User? GetUserById(string id)
    {
        var res = _chatContext.Users.FirstOrDefault(u => u.Id == id);
        
        return res;
    }
}