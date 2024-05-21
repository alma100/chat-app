using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using chat_WebSockets_server.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_WebSockets_server.WebSocketController;

[ApiController]
[Route("ws/[controller]")]
public class MessageController : ControllerBase
{

    private IMessageRepository _messageRepository;

    public MessageController(IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }


    [HttpGet("GetAllChatMessage")]
    [Authorize(Roles = "user")]
    public ActionResult GetAllChatMessage()
    {
        var httpContext = HttpContext;
        string jwtToken = httpContext.Request.Cookies["access_token"];
        var userId = GetUserIdByJwTtoken(jwtToken);

        var res = _messageRepository.GetMessageByUser(userId);

        return Ok(res);
    }
    
    [HttpGet("GetChatMessage/{chatId}")]
    public ActionResult GetChatMessage()
    {
        return Ok();
    }
    
    
    private string GetUserIdByJwTtoken(string jwtToken)
    {
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(jwtToken);

        // A claim-ek kiolvasása a JWT tokenből
        var claims = token.Claims.ToList();

        var userId = "";

        foreach (var claim in claims)
        {
            if (claim.Type == ClaimTypes.NameIdentifier)
            {
                userId = claim.Value;
            }
        }

        return userId;
    }
}