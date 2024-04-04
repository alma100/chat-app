namespace chat_HTTP_server.Model;

public class Message
{
    public string MessageId { get; set; }
    
    public string Content { get; set; }
    
    public string UserId { get; set; }
    
    public DateTime CreatedAt { get; set; }
}