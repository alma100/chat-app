using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using chat_HTTP_server.Model;
using chat_HTTP_server.Repository;
using chat_HTTP_server.Repository.ChatRepository;
using chat_HTTP_server.Service.ChatService;
using chat_HTTP_server.Service.SearchRequest;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_HTTP_server.Controller;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private IUserRepository _userRepository;

    private IChatRepository _chatRepository;

    public ChatController(IUserRepository userRepository, IChatRepository chatRepository)
    {
        _userRepository = userRepository;
        _chatRepository = chatRepository;
    }

    [HttpPost("getUserByName")]
    [Authorize(Roles = "user")]
    public async Task<ActionResult> GetUserByName(SearchRequest searchRequest)
    {
        string jwtToken = HttpContext.Request.Cookies["access_token"];

        if (jwtToken == null)
        {
            return Unauthorized();
        }

        var userId = GetUserIdByJwTtoken(jwtToken);
        
        var result = await _userRepository.GetUserByName(searchRequest.name, userId);
        var userDtos = result.Select(u => new UserDto {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName
        }).ToList();
    
        return Ok(userDtos);
    }
    
    [HttpPost("getUserById")]
    [Authorize(Roles = "user")]
    public async Task<ActionResult> GetUserById([FromBody]string userId)
    {
        Console.WriteLine(userId);
        var result = await _userRepository.GetUserById(userId);
        var userDtos = new UserDto
        {
            Id = result.Id,
            FirstName = result.FirstName,
            LastName = result.LastName
        };
    
        return Ok(userDtos);
    }
    
    [HttpPost("creatChat")]
    [Authorize(Roles = "user")]
    public async Task<IActionResult> CreateChat(CreateChatRequest request)
    {
        var users = await _userRepository.GetUserById(request.Usersid);
        Chat newChat = new Chat
        {
            Messages = new List<Message>(),
            Users = users
        };
        
        string jwtToken = HttpContext.Request.Cookies["access_token"];
        var userId = GetUserIdByJwTtoken(jwtToken);

        var userFullname = users.Where(u => u.Id != userId).Select(u => u.FirstName + " " + u.LastName).ToList();
        var chatId = await _chatRepository.CreateChat(newChat);
        if (chatId == -1)
        {
            return BadRequest();
        }
        var chatTdo = new ChatDto
        {
            Id = chatId,
            UsersFullName = userFullname
        };
        return Ok(chatTdo);
    }

    [HttpGet("getAllChat")]
    [Authorize(Roles = "user")]
    public async Task<ActionResult> GetAllChat()
    {
        string jwtToken = HttpContext.Request.Cookies["access_token"];
        var userId = GetUserIdByJwTtoken(jwtToken);

        var res = await _userRepository.GetAllChatByUserId(userId);
        
        return Ok(res);
    }

    private string GetUserIdByJwTtoken(string jwtToken)
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
}