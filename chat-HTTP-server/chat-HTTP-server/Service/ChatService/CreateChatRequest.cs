using System.ComponentModel.DataAnnotations;

namespace chat_HTTP_server.Service.ChatService;

public record CreateChatRequest([Required] List<string> Usersid);
