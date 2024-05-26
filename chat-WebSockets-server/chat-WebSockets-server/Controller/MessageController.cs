using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices.JavaScript;
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
    
    private IConfiguration _configuration;
    

    public MessageController(IMessageRepository messageRepository, IConfiguration configuration)
    {
        _messageRepository = messageRepository;
        _configuration = configuration;
    }


    [HttpGet("GetAllChatMessage")]
    //[Authorize(Roles = "user")]
    public ActionResult GetAllChatMessage()
    {
        var httpContext = HttpContext;
        string jwtToken = httpContext.Request.Cookies["access_token"];
        var userId = GetUserIdByJwTtoken(jwtToken);

        var currentIndex = updateCurrentMessageIndex(0);
        
        var res = _messageRepository.GetMessageByUser(userId, currentIndex);

        return Ok(res);
    }
    
    [HttpGet("GetChatMessage/{chatId}/{index}")]
    public async Task<ActionResult> GetChatMessage(int chatId, int index)
    {
        Console.WriteLine(chatId);
        var currentIndex = 0;
        
        if (index == 0 )
        {
            currentIndex = updateCurrentMessageIndex(0);
        }
        else
        {
            currentIndex = updateCurrentMessageIndex(index);
        }
        
        Console.WriteLine(currentIndex);
        var res =await  _messageRepository.GetMessageByChatId(chatId, currentIndex);
        
        return Ok(res);
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

    private int updateCurrentMessageIndex(int index)
    {
        var initialIndex = Int32.Parse(_configuration["MessageIndex:InitialIndex"]);
        
        if (index == 0)
        {
            return initialIndex;
        }

        var newIndex = index + initialIndex;
        
        return newIndex;
    }
}