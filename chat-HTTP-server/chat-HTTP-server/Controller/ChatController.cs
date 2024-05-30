using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices.JavaScript;
using System.Security.Claims;
using chat_HTTP_server.Mapper;
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
    private readonly IUserRepository _userRepository;

    private readonly IChatRepository _chatRepository;

    private readonly ILogger<ChatController> _logger;

    public ChatController(IUserRepository userRepository, IChatRepository chatRepository, ILogger<ChatController> logger)
    {
        _userRepository = userRepository;
        _chatRepository = chatRepository;
        _logger = logger;
    }

    [HttpPost("GetUserByName")]
    [Authorize(Roles = "user")]
    public async Task<ActionResult> GetUserByName(SearchRequest searchRequest)
    {
        var clientIp = GetClientIp(HttpContext);
        
        try
        {
            var userId = HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                _logger.LogWarning($"Client with this IP: {clientIp} try to searched some user with this keyword: {searchRequest.Name}, " +
                                   $"but did not have the appropriate authorization. at: {DateTime.UtcNow}");
                return Unauthorized();
            }
        
            var result = await _userRepository.GetUserByName(searchRequest.Name, userId);
        
            var userDtos = result.Select(u => u.ConvertUserToUserDto()).ToList();
            
            _logger.LogInformation($"User with this ID: {userId} searched some user successfully with this keyword: {searchRequest.Name} at:{DateTime.UtcNow}");
    
            return Ok(userDtos);
        }
        catch (Exception e)
        {
            _logger.LogInformation($"Client with this IP: {clientIp} try to searched some user with this keyword: {searchRequest.Name}," +
                                   $"but unexpected error occured: {e} at:{DateTime.UtcNow}");

            return StatusCode(500);
        }
        
    }
    
    [HttpPost("GetUserById")]
    [Authorize(Roles = "user")]
    public async Task<ActionResult> GetUserById([FromBody]string userId)
    {
        var clientIp = GetClientIp(HttpContext);
        
        try
        {
            var currentUserId = HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var result = await _userRepository.GetUserById(userId);
        
            var userDto = result.ConvertUserToUserDto();
    
            _logger.LogInformation($"User with this ID: {currentUserId} request user, user ID: {userId} data at:{DateTime.UtcNow}");
            
            return Ok(userDto);
        }
        catch (Exception e)
        {
            _logger.LogInformation($"Client with this IP: {clientIp} try to get this user data, user ID: {userId}," +
                                   $"but unexpected error occured: {e} at:{DateTime.UtcNow}");
            
            return StatusCode(500);
        }
       
    }
    
    [HttpPost("CreatChat")]
    [Authorize(Roles = "user")]
    public async Task<IActionResult> CreateChat(CreateChatRequest request)
    {
        var clientIp = GetClientIp(HttpContext);
        
        try
        {
            var userId = HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var users = await _userRepository.GetUserById(request.Usersid);
        
            Chat newChat = new Chat
            {
                Messages = new List<Message>(),
                Users = users
            };
        
            
            var chatId = await _chatRepository.CreateChat(newChat);
        
            if (chatId == -1)
            {
                _logger.LogWarning($"User with this ID: {userId} try to created chat but the same chat already exists at: {DateTime.UtcNow}." );
                
                return BadRequest();
            }
            
            var userFullname = users.Where(u => u.Id != userId).Select(u => u.FirstName + " " + u.LastName).ToList();
        
            var chatTdo = new ChatDto
            {
                Id = chatId,
                UsersFullName = userFullname
            };
            
            _logger.LogInformation($"User with this ID: {userId} created a new chat, chat ID: {chatId} at: {DateTime.UtcNow}.");
            
            return Ok(chatTdo);
        }
        catch (Exception e)
        {
            _logger.LogInformation($"Client with this IP: {clientIp} try to create a new chat," +
                                   $"but unexpected error occured: {e} at:{DateTime.UtcNow}");
            
            return StatusCode(500);
        }
        
    }

    [HttpGet("GetAllChat")]
    [Authorize(Roles = "user")]
    public async Task<ActionResult> GetAllChat()
    {
        var clientIp = GetClientIp(HttpContext);
        
        try
        {
            var userId = HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                _logger.LogWarning($"Client with this IP: {clientIp} try to request chat data, at: {DateTime.UtcNow}");
                
                return Unauthorized();
            }
        
            var res = await _userRepository.GetAllChatByUserId(userId);
        
            _logger.LogInformation($"User with this ID: {userId} request his all chat, at: {DateTime.UtcNow}");
            
            return Ok(res);
        }
        catch (Exception e)
        {
            _logger.LogWarning($"Client with this IP: {clientIp} try to request chat data," +
                                   $"but unexpected error occured: {e} at:{DateTime.UtcNow}");
            
            return StatusCode(500);
        }
        
    }
    
    private static string GetClientIp(HttpContext httpContext)
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString();

        if (httpContext.Request.Headers.ContainsKey("X-Forwarded-For"))
        {
            ip = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        }

        return ip;
    }
    
}