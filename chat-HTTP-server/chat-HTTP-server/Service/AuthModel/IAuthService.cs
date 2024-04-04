namespace chat_HTTP_server.Service.AuthModel;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(string email, string username, string password, string role, string FirdtName, string LastName);
    
    Task<AuthResult> LoginAsync(string username, string password);
}