
using System.IdentityModel.Tokens.Jwt;
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

    [HttpPost("Login")]
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
                
                SetTokenCookie(authResult.Token, "access_token");
                
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
            _logger.LogError($"Client with this IP:{clientIp} try to sign up in with this username: {request.Username} but unexpected error occured: {e} at:{DateTime.UtcNow}");
            
            return StatusCode(500);
        }

        
    }
    
    [HttpPost("Logout")]
    [Authorize]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token");
        
        var userId = HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        _logger.LogInformation($"User Id: {userId} log out at: {DateTime.UtcNow}");
        
        return Ok();
    }
    
    [HttpGet("UsernameValidator/{username}")]
    public IActionResult UsernameValidator(string username)
    {
        var clientIp = GetClientIp(HttpContext);
        
        try
        {
            var res = _userRepository.IsUsernameValid(username);

            if (res)
            {
                _logger.LogInformation($"Client with IP: {clientIp} validate his {username} at: {DateTime.UtcNow}");
                
                return Ok();
            }

            _logger.LogWarning($"Client with IP: {clientIp} try to validate his {username}, but username is used. at: {DateTime.UtcNow}");
            
            return StatusCode(422);
        }
        catch (Exception e)
        {
            _logger.LogError($"Client whit this IP: {clientIp} try to validate his {username} but unexpected error occured: {e} at:{DateTime.UtcNow}");
            
            return BadRequest();
        }
    }
    
    [HttpGet("EmailValidator/{email}")]
    public IActionResult EmailValidator(string email)
    {
        var clientIp = GetClientIp(HttpContext);
        
        try
        {
            var res = _userRepository.IsEmailValid(email);

            if (res)
            {
                _logger.LogInformation($"Client with IP: {clientIp} validate his {email} at: {DateTime.UtcNow}");
                
                return Ok();
            }
            
            _logger.LogWarning($"Client with IP: {clientIp} try to validate his {email}, but email is used. at: {DateTime.UtcNow}");
            
            return StatusCode(422);
        }
        catch (Exception e)
        {
            
            _logger.LogError($"Client whit this IP: {clientIp} try to validate his {email} but unexpected error occured: {e} at:{DateTime.UtcNow}");
            
            return StatusCode(500);
        }
    }
    
    [HttpGet("HowAmI")]
    public async Task<ActionResult> HowAmI()
    {
        try
        {
            var userId = HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (userId == null)
            {
                var clientIp = GetClientIp(HttpContext);
                
                _logger.LogWarning($"Client with this Ip: {clientIp} try to request user data at: {DateTime.UtcNow}.");
                
                return Unauthorized();
            }

            var res = await _userRepository.GetUserById(userId);
            
            _logger.LogInformation($"User with this ID: {userId} request his data at:{DateTime.UtcNow}");
            
            return Ok(new AuthResponse(res.Email, res.UserName, res.Id));
        }
        catch (Exception e)
        {
            var clientIp = GetClientIp(HttpContext);
            
            _logger.LogError($"Client whit this IP: {clientIp} try to request user data but unexpected error occured: {e} at:{DateTime.UtcNow}");
            
            return StatusCode(500);
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
    
    private void SetTokenCookie(string token, string tokenName)
    {
       
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append(tokenName, token, cookieOptions);
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