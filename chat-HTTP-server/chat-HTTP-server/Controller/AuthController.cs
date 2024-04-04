
using System.Security.Claims;
using chat_HTTP_server.Service.AuthModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_HTTP_server.Controller;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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