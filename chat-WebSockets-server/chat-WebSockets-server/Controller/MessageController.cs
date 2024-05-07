using Microsoft.AspNetCore.Mvc;

namespace chat_WebSockets_server.WebSocketController;

[ApiController]
public class MessageController : ControllerBase
{
    [HttpPost("GetAllChatMessage")]
    public ActionResult GetAllChatMessage(List<int> chatIds)
    {
        return Ok();
    }
    
    [HttpGet("GetChatMessage/{chatId}")]
    public ActionResult GetChatMessage()
    {
        return Ok();
    }
}