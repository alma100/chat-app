namespace chat_WebSockets_server.Model;

public class Message
{
    public int? MessageId { get; set; }
    
    public string Content { get; set; }
    
    public string UserId { get; set; }
    
    public DateTime? CreatedAt { get; set; }
    
    public string ChatId { get; set; }
}