using chat_HTTP_server.Context;
using chat_HTTP_server.Model;

namespace chat_HTTP_server.Repository.ChatRepository;

public class ChatRepository : IChatRepository
{
    private readonly ChatContext _chatContext;

    public ChatRepository(ChatContext chatContext)
    {
        _chatContext = chatContext;
    }
    
    public async Task<int>? CreateChat(Chat chat)
    {
        var sortedNewChatUsers = chat.Users.OrderBy(u => u.Id).Select(u => u.Id).ToList();
       
        // Ellenőrzés, hogy létezik-e ilyen chat
        var chatExists = _chatContext.Chat
            .Any(c => c.Users.Count == sortedNewChatUsers.Count &&
                      c.Users.OrderBy(u => u.Id).Select(u => u.Id)
                          .All(u => sortedNewChatUsers.Contains(u)));
                                                         
        Console.WriteLine($"Létezik?: {chatExists}");
        if (chatExists)
        {
            return -1;
        }
        await _chatContext.Chat.AddAsync(chat);
        await _chatContext.SaveChangesAsync();
        return chat.Id;
    }

    public List<Message> GetAllMesage()
    {
        return _chatContext.Message.ToList();
    }
}