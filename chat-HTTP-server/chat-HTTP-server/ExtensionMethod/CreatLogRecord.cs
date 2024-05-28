using chat_HTTP_server.Model;

namespace chat_HTTP_server.Mapper;

public static class CreatLogRecord
{
    public static LogModel CreateLog(this LogEnum logType, string message)
    {
        return new LogModel
        {
            LogType = logType,
            LogMessage = message,
            CreatedAt = DateTime.Now
        };
    }
}