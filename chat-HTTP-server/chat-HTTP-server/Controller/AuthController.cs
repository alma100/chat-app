
using System.Security.Claims;
using chat_HTTP_server.Repository;
using chat_HTTP_server.Service.AuthModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace chat_HTTP_server.Controller;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private IAuthService _authService;

    private IUserRepository _userRepository;
    public AuthController(IAuthService authService, IUserRepository userRepository)
    {
        _authService = authService;
        _userRepository = userRepository;
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
            var authResult = await _authService.LoginAsync(request.name, request.password);
            if (authResult.Success)
            {
                
                setTokenCookie(authResult.Token, "access_token");
                return Ok(new AuthResponse(authResult.Email, authResult.UserName));
            }

            return Unauthorized();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
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