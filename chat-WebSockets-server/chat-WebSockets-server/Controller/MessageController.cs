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

    private readonly IMessageRepository _messageRepository;
    
    private readonly IConfiguration _configuration;

    private readonly ILogger<MessageController> _logger;
    

    public MessageController(IMessageRepository messageRepository, IConfiguration configuration, ILogger<MessageController> logger)
    {
        _messageRepository = messageRepository;
        _configuration = configuration;
        _logger = logger;
    }

    
    [HttpGet("GetChatMessage/{chatId}/{index}")]
    [Authorize(Roles = "user")]
    public async Task<ActionResult> GetChatMessage(int chatId, int index)
    {
        try
        {
            string jwtToken = HttpContext.Request.Cookies["access_token"];

            if (jwtToken == null)
            {
                var clientIp = GetClientIp(HttpContext);
                
                _logger.LogWarning($"{clientIp} try to request {chatId} messages in range {index}");
                
                return Unauthorized();
            }
                
            var currentIndex = 0;
        
            if (index == 0 )
            {
                currentIndex = UpdateCurrentMessageIndex(0);
            }
            else
            {
                currentIndex = UpdateCurrentMessageIndex(index);
            }

            var user = GetUserIdByJwtToken(jwtToken);
            
            _logger.LogInformation($"{user} successfull request chat ID:{chatId} messages in range {index}");
            
            var res =await  _messageRepository.GetMessageByChatId(chatId, currentIndex);
            
            return Ok(res);
        }
        catch (Exception e)
        {
            var clientIp = GetClientIp(HttpContext);
            
            _logger.LogError($"{clientIp} try to request chat ID:{chatId} messages in range {index} but unexpected error occured: {e}");
            
            throw;
        }
        
    }

    private int UpdateCurrentMessageIndex(int index)
    {
        var initialIndex = Int32.Parse(_configuration["MessageIndex:InitialIndex"]);
        
        if (index == 0)
        {
            return initialIndex;
        }

        var newIndex = index + initialIndex;
        
        return newIndex;
    }
    
    private static string GetUserIdByJwtToken(string jwtToken)
    {
        var handler = new JwtSecurityTokenHandler();
        
        var token = handler.ReadJwtToken(jwtToken);
        
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

    private string GetClientIp(HttpContext httpContext)
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString();

        if (httpContext.Request.Headers.ContainsKey("X-Forwarded-For"))
        {
            ip = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        }

        return ip;
    }
}