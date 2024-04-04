using chat_HTTP_server.Model;

namespace chat_HTTP_server.Service.AuthModel;

public interface ITokenService
{
    string CreateToken(User user, string role);
}