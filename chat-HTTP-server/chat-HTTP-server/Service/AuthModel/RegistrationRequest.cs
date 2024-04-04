using System.ComponentModel.DataAnnotations;

namespace chat_HTTP_server.Service.AuthModel;

public record RegistrationRequest(
    [Required]string Email, 
    [Required]string Username, 
    [Required]string Password,
    [Required]string Role,
    [Required]string FirstName,
    [Required]string LastName);