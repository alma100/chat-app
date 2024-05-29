
using System.Security.Claims;
using chat_HTTP_server.Mapper;
using chat_HTTP_server.Model;
using chat_HTTP_server.Repository;
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

    private readonly ILogger<AuthController> _logger;
    
    public AuthController(IAuthService authService, IUserRepository userRepository, ILogger<AuthController> logger)
    {
        _authService = authService;
        _userRepository = userRepository;
        _logger = logger;
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
                
                _logger.LogInformation($"User with this ID:{authResult.Id} log into at: {DateTime.UtcNow}");
                
                return Ok(new AuthResponse(authResult.Email, authResult.UserName, authResult.Id));
            }

            var ip = GetClientIp(HttpContext);
            
            _logger.LogWarning($"Client with this IP:{ip} try to log in with this email/username: {request.Name} at: {DateTime.UtcNow}");
            
            return Unauthorized();
        }
        catch (Exception e)
        {
            var clientIp = GetClientIp(HttpContext);
            
            _logger.LogError($"Client with this IP:{clientIp} try to log in with this email/username: {request.Name} but unexpected error occured: {e} at:{DateTime.UtcNow}");
            
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

        var clientIp = GetClientIp(HttpContext);

        try
        {
            var identityRegistration = await _authService.RegisterAsync(request.Email, request.Username, request.Password, "user", request.FirstName, request.LastName);

            if (!identityRegistration.Success)
            {
                AddErrors(identityRegistration, clientIp);
                return BadRequest(ModelState);
            }
        
            _logger.LogInformation($"Client with this IP:{clientIp} successfull registered with this username: {identityRegistration.UserName} at: {DateTime.UtcNow}");
            
            return CreatedAtAction(nameof(Register), new RegistrationResponse(identityRegistration.Email, identityRegistration.UserName));
        }
        catch (Exception e)
        {
            _logger.LogError($"Client with this IP:{clientIp} try to sing up in with this email/username: {request.Name} but unexpected error occured: {e} at:{DateTime.UtcNow}");
            
            return StatusCode(500);
        }

        
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
    
    private void AddErrors(AuthResult result, string clientIp)
    {
        foreach (var error in result.ErrorMessages)
        {
            _logger.LogWarning($"Client with this IP:{clientIp} try to registration, but some error occured. Error: {error.Key}, {error.Value}");
            
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