using chat_HTTP_server.Repository.ChatRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_HTTP_server.Controller;

[ApiController]
[Route("api/[controller]")]
public class HealthCheck : ControllerBase
{
    private IChatRepository _chatRepository;

    public HealthCheck(IChatRepository chatRepository)
    {
        _chatRepository = chatRepository;
    }


    [HttpGet("HealtCheck")]
    public ActionResult HealtCheck()
    {
        return Ok();
    }
    
    [HttpGet("test")]
    [Authorize(Roles = "user")]
    public ActionResult Test()
    {
        var res = _chatRepository.GetAllMesage();
        return Ok(res);
    }
}