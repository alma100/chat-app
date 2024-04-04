using System.ComponentModel.DataAnnotations;

namespace chat_HTTP_server.Service.AuthModel;

public record AuthRequest([Required]string name, [Required]string password);