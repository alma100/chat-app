using chat_HTTP_server.Repository.ChatRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_HTTP_server.Controller;

[ApiController]
[Route("api/[controller]")]
public class HealthCheck : ControllerBase
{
    [HttpGet("HealthCheck")]
    public ActionResult Health()
    {
        return Ok();
    }
    
}