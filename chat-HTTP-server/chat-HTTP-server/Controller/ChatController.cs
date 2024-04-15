using chat_HTTP_server.Model;
using chat_HTTP_server.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_HTTP_server.Controller;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private IUserRepository _userRepository;

    public ChatController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet("getUserByName/{name}")]
    [Authorize(Roles = "user")]
    public IActionResult GetUserByName(string name)
    {
        
        var result = _userRepository.GetUserByName(name);
        var userDtos = result.Select(u => new UserDto {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName
        }).ToList();
    
        return Ok(userDtos);
    }
}