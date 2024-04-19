namespace chat_WebSockets_server.Model;

public class Chat
{
    public int Id { get; set; }
    
    public List<Message> Messages { get; set; }
    
    public List<User> Users { get; set; }
}