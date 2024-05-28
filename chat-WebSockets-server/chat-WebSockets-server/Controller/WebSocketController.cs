using System.IdentityModel.Tokens.Jwt;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Text;
using chat_WebSockets_server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_WebSockets_server.WebSocketController;

public class WebSocketController : ControllerBase
{
    private readonly IChatService _chatService;

    private readonly ILogger<WebSocketController> _logger;
    
    public WebSocketController(IChatService chatService, ILogger<WebSocketController> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    [Route("/ws")]
    [Authorize(Roles = "user")]
    public async Task Get()
    {
        try
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                
                await _chatService.HandleWebSocketConnection(webSocket);
                
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }
        catch (Exception e)
        {
            var clientIp = GetClientIp(HttpContext);
            
            _logger.LogError($"{clientIp} try to jointo the websocket-server but unexpected error occured: {e}");
            
            throw;
        }
        
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