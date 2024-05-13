namespace chat_HTTP_server.Model;

public class Emoji
{
    public int Id { get; set; }
    
    public string EmojiName { get; set; }
    
    public string UserId { get; set; }
    
    public int MessageId { get; set; }
}