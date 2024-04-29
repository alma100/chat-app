namespace chat_WebSockets_server.Model;

public class WebSocketObj
{
    public string Event { get; set; }
    
    public string UserID { get; set; }
    
    public string? Content { get; set; }
    
    public int ChatId { get; set; }
    
    public DateTime? CreatedAt { get; set; }
}