using Microsoft.AspNetCore.Identity;

namespace chat_WebSockets_server.Model;

public class User : IdentityUser
{
    public string FirstName { get; set; }
    
    public string LastName { get; set; }
    
    public List<Chat> Chats { get; set; }
}