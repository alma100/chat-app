using System.Net.WebSockets;

namespace chat_WebSockets_server.Service;

public interface IChatService
{
    Task HandleWebSocketConnection(WebSocket socket);
    
    
}