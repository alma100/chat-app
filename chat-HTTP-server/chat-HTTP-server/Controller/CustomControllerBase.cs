namespace chat_HTTP_server.Controller;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/[controller]")]
public class CustomControllerBase<T> : ControllerBase
    where T : CustomControllerBase<T>
{
    protected ILogger<T> Logger;

    protected CustomControllerBase(ILogger<T> logger)
    {
            Logger = logger;
    }
}
