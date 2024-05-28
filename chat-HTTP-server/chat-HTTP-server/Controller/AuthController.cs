
using System.Security.Claims;
using chat_HTTP_server.Mapper;
using chat_HTTP_server.Model;
using chat_HTTP_server.Repository;
using chat_HTTP_server.Repository.LogRepository;
using chat_HTTP_server.Service.AuthModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_HTTP_server.Controller;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    private readonly IUserRepository _userRepository;

    private readonly ILogRepository _log;
    public AuthController(IAuthService authService, IUserRepository userRepository, ILogRepository log)
    {
        _authService = authService;
        _userRepository = userRepository;
        _log = log;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(AuthRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }
        
        try
        {
            var authResult = await _authService.LoginAsync(request.Name, request.Password);
            
            if (authResult.Success)
            {
                
                setTokenCookie(authResult.Token, "access_token");
                
                var log = LogEnum.logInfo.CreateLog($"{authResult.UserName} logged in");
                
                await _log.AddLog(log);
                
                return Ok(new AuthResponse(authResult.Email, authResult.UserName, authResult.Id));
            }

            return Unauthorized();
        }
        catch (Exception e)
        {
            var log = LogEnum.logError.CreateLog($"login process failed: {e}");
                
            await _log.AddLog(log);

            return StatusCode(500);
        }
    }
    
    [HttpPost("Register")]
    public async Task<ActionResult<RegistrationResponse>> Register(RegistrationRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var identityRegistration = await _authService.RegisterAsync(request.Email, request.Username, request.Password, "user", request.FirstName, request.LastName);

        if (!identityRegistration.Success)
        {
            AddErrors(identityRegistration);
            return BadRequest(ModelState);
        }
        
        return CreatedAtAction(nameof(Register), new RegistrationResponse(identityRegistration.Email, identityRegistration.UserName));
    }
    
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
       Response.Cookies.Delete("access_token");

        return Ok();
    }
    
    [HttpGet("UsernameValidator/{username}")]
    public IActionResult UsernameValidator(string username)
    {
        try
        {
            var res = _userRepository.IsUsernameValid(username);

            if (res)
            {
                return Ok();
            }

            return StatusCode(422);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest();
        }
    }
    
    [HttpGet("EmailValidator/{email}")] //loggolás, ip korlátozás
    public IActionResult EmailValidator(string email)
    {
        try
        {
            var res = _userRepository.IsEmailValid(email);

            if (res)
            {
                return Ok();
            }

            return StatusCode(422);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest();
        }
    }
    
    [HttpGet("HowAmI")]
    public async Task<ActionResult> HowAmI()
    {
        try
        {
            //var token = HttpContext.Request.Cookies["access_token"];
            var userId = HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (userId == null)
            {
                return Unauthorized();
            }

            var res = await _userRepository.GetUserById(userId);
            
            return Ok(new AuthResponse(res.Email, res.UserName, res.Id));
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        
    }
    
    private void AddErrors(AuthResult result)
    {
        foreach (var error in result.ErrorMessages)
        {
            ModelState.AddModelError(error.Key, error.Value);
        }
    }
    
    private void setTokenCookie(string token, string tokenName)
    {
       
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append(tokenName, token, cookieOptions);
    }
    
}