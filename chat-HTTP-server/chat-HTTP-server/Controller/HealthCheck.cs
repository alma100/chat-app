using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_HTTP_server.Controller;

[ApiController]
[Route("api/[controller]")]
public class HealthCheck : ControllerBase
{

    [HttpGet("HealtCheck")]
    public ActionResult HealtCheck()
    {
        return Ok();
    }
    
    [HttpGet("test")]
    [Authorize(Roles = "user")]
    public ActionResult Test()
    {
        return Ok();
    }
}