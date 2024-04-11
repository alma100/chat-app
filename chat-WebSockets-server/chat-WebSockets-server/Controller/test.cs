using Microsoft.AspNetCore.Mvc;

namespace chat_WebSockets_server.WebSocketController;

[ApiController]
public class test :ControllerBase
{
    [HttpGet("Test")]
    public ActionResult Test()
    {
        return Ok();
    }
}