using System.Security.Claims;
using chat_HTTP_server.Model;
using Microsoft.AspNetCore.Identity;

namespace chat_HTTP_server.Service.AuthModel;

public class AuthService : IAuthService
{
    private readonly SignInManager<User> _singInManager;
    
    private readonly UserManager<User> _userManager;

    private readonly ITokenService _tokenService;

    public AuthService(SignInManager<User> sgiSignInManager, UserManager<User> userManager, ITokenService tokenService)
    {
        _singInManager = sgiSignInManager;
        _userManager = userManager;
        _tokenService = tokenService;
    }
    
    
    public async Task<AuthResult> RegisterAsync(string email, string username, string password, string role, string firstName, string lastName)
    {
        var user = new User { UserName = username, Email = email, LastName = lastName, FirstName = firstName };
        var result = await _userManager.CreateAsync(user, password);
       
        if (!result.Succeeded)
        {
            return FailedRegistration(result, email, username);
        }

        await _userManager.AddToRoleAsync(user, role); // Adding the user to a role
        return new AuthResult(true, email, username, "");
    }

    public async Task<AuthResult> LoginAsync(string username, string password)
    {
        var managedUserByEmail = await _userManager.FindByEmailAsync(username);

        var managedUserByUserName = await _userManager.FindByNameAsync(username);
        
        if (managedUserByEmail == null && managedUserByUserName == null)
        {
            
            return InvalidEmailOrUsername(username);
        }

        var validInput = managedUserByEmail != null ? managedUserByEmail : managedUserByUserName;
        
        var test = await _singInManager.PasswordSignInAsync(validInput, password, isPersistent: false, lockoutOnFailure: true);
        //var test = await  _userManager.CheckPasswordAsync(validInput, password);
        
        if (!test.Succeeded)
        {
            return InvalidPassword(username, validInput.UserName);
        }
        var roles = await _userManager.GetRolesAsync(validInput);
        var accessToken = _tokenService.CreateToken(validInput, roles[0]);

        return new AuthResult(true, validInput.Email, validInput.UserName, accessToken);
    }
    
    
    private static AuthResult FailedRegistration(IdentityResult result, string email, string username)
    {
        var authResult = new AuthResult(false, email, username, "");

        foreach (var error in result.Errors)
        {
            authResult.ErrorMessages.Add(error.Code, error.Description);
        }

        return authResult;
    }
    
    private static AuthResult InvalidEmailOrUsername(string input)
    {
        var result = new AuthResult(false, input, "", "");
        result.ErrorMessages.Add("Bad credentials", "Invalid email or username");
        return result;
    }
    
    private static AuthResult InvalidPassword(string input, string userName)
    {
        var result = new AuthResult(false, input, userName, "");
        result.ErrorMessages.Add("Bad credentials", "Invalid password");
        return result;
    }
    
    
}