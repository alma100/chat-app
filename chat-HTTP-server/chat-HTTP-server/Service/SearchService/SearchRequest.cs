using System.ComponentModel.DataAnnotations;

namespace chat_HTTP_server.Service.SearchRequest;

public record SearchRequest([Required] string name);
