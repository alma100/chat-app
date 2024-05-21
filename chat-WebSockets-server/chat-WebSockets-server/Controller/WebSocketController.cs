using System.Net.WebSockets;
using System.Text;
using chat_WebSockets_server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_WebSockets_server.WebSocketController;

public class WebSocketController : ControllerBase
{
    private IChatService _chatService;
    
    public WebSocketController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [Route("/ws")]
    [Authorize(Roles = "user")]
    public async Task Get()
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
    
    /*[Route("/ws/update")]
    public async Task GetUserData()
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
    }*/
   
}