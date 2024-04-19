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
    
    public async Task<int> CreateChat(Chat chat)
    {
        await _chatContext.Chat.AddAsync(chat);
        await _chatContext.SaveChangesAsync();
        return chat.Id;
    }

    public List<Message> GetAllMesage()
    {
        return _chatContext.Message.ToList();
    }
}