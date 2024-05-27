namespace chat_HTTP_server.Repository.LogRepository;
using chat_HTTP_server.Model;

public interface ILogRepository
{
    Task AddLog(LogModel log);
}