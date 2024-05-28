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

    
    [HttpGet("GetChatMessage/{chatId}/{index}")]
    [Authorize(Roles = "user")]
    public async Task<ActionResult> GetChatMessage(int chatId, int index)
    {
        var currentIndex = 0;
        
        if (index == 0 )
        {
            currentIndex = updateCurrentMessageIndex(0);
        }
        else
        {
            currentIndex = updateCurrentMessageIndex(index);
        }
        
        var res =await  _messageRepository.GetMessageByChatId(chatId, currentIndex);
        
        return Ok(res);
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