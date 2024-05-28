using chat_HTTP_server.Context;
using chat_HTTP_server.Model;

namespace chat_HTTP_server.Repository.LogRepository;

public class LogRepository : ILogRepository
{
    private readonly ChatContext _chatContext;

    public LogRepository(ChatContext chatContext)
    {
        _chatContext = chatContext;
    }

    public async Task AddLog(LogModel log)
    {
        Console.WriteLine(log.LogType);
        await _chatContext.Log.AddAsync(log);

        await _chatContext.SaveChangesAsync();
    }
}