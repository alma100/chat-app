namespace chat_WebSockets_server.Model;

public class WebSocketObj
{
    public string Event { get; set; }
    
    public string UserId { get; set; }
    
    public string? Content { get; set; }
    public Message? Message { get; set; }
    
    public DateTime? CreatedAt { get; set; }
}