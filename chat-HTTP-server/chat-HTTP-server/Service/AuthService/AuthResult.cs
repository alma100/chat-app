using System.Security.Claims;

namespace chat_HTTP_server.Service.AuthModel;

public record AuthResult(
    bool Success,
    string Email,
    string UserName,
    string Token,
    string Id)
{
    //Error code - error message
    public readonly Dictionary<string, string> ErrorMessages = new();
}